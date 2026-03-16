#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_csi.h"

#include "config.h"

static const char *TAG = "MAIN";

extern "C" void app_main(void) {
    ESP_LOGI(TAG, "=== SafeHome ESP32 CSI Firmware v1.0 ===");
    ESP_LOGI(TAG, "Thresholds: MOTION=%.1f, NOISE_FLOOR=%.1f", MOTION_THRESHOLD, MOTION_NOISE_FLOOR);
    
    // Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    
    // Initialize WiFi
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    esp_netif_create_default_wifi_sta();
    
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    
    // Enable WiFi CSI
    ESP_ERROR_CHECK(esp_wifi_set_csi(1));
    
    // Set WiFi configuration
    wifi_config_t wifi_config = {};
    strcpy((char*)wifi_config.sta.ssid, WIFI_SSID);
    strcpy((char*)wifi_config.sta.password, WIFI_PASSWORD);
    wifi_config.sta.threshold.authmode = WIFI_AUTH_WPA2_PSK;
    wifi_config.sta.pmf_cfg.capable = true;
    wifi_config.sta.pmf_cfg.required = false;
    
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
    
    ESP_LOGI(TAG, "WiFi started. Connecting to: %s", WIFI_SSID);
    ESP_ERROR_CHECK(esp_wifi_connect());
    
    // CSI callback (simplified for now)
    esp_csi_cb_t csi_cb = [](void* ctx, wifi_csi_info_t* info) {
        static uint32_t count = 0;
        count++;
        
        if (count % 20 == 0) { // Every second (20Hz)
            float amplitude = 0.0;
            for (int i = 0; i < info->len; i++) {
                amplitude += std::abs(info->buf[i]);
            }
            amplitude /= info->len;
            
            // Simple motion calculation
            static float baseline = 0.0;
            if (count < CALIBRATION_FRAMES) {
                baseline = amplitude;
            } else {
                float motion = std::abs(amplitude - baseline);
                
                // Apply new thresholds
                if (motion < MOTION_NOISE_FLOOR) {
                    motion = 0.0;
                }
                
                // Scale for dashboard
                motion *= MOTION_SCALE_FACTOR;
                
                // Debug output
                if (motion > MOTION_THRESHOLD) {
                    ESP_LOGI(TAG, "MOTION DETECTED: %.2f > %.2f", motion, MOTION_THRESHOLD);
                }
            }
        }
    };
    
    ESP_ERROR_CHECK(esp_csi_register_callback(csi_cb, NULL));
    
    // Main loop
    while (true) {
        ESP_LOGI(TAG, "System running... RSSI: %d", esp_wifi_sta_get_rssi());
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}