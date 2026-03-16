// SafeHome ESP32 CSI Firmware Configuration
#pragma once

// WiFi Configuration
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD ""

// MQTT Configuration
#define MQTT_BROKER "YOUR_MQTT_BROKER_IP"
#define MQTT_PORT 1883
#define MQTT_TOPIC_CSI "safehome/csi/1"
#define MQTT_TOPIC_PRESENCE "safehome/presence/1"
#define MQTT_TOPIC_STATUS "safehome/status/1"

// CSI Configuration
#define CSI_SUBCARRIER_COUNT 256
#define CSI_CALLBACK_MS 50          // 20Hz
#define CSI_BUFFER_SIZE 100

// Thresholds (CRITICAL FIXES!)
#define MOTION_THRESHOLD 0.5        // Fixed from 10.0 to 0.5
#define MOTION_NOISE_FLOOR 0.3      // Filter out noise < 0.3
#define VARIANCE_THRESHOLD 0.5      // Empty room detection
#define MOTION_SCALE_FACTOR 3.0     // Scale for dashboard (2-50 range)
#define CALIBRATION_FRAMES 200      // 10 seconds at 20Hz

// Presence Engine States
typedef enum {
    PRESENCE_EMPTY = 0,
    PRESENCE_DETECTED = 1,
    PRESENCE_PRESENT = 2,
    PRESENCE_ACTIVE = 3
} presence_state_t;

// Debug Settings
#define DEBUG_ENABLED 1
#define SERIAL_BAUD 115200

// Timing Intervals (ms)
#define MQTT_PUBLISH_INTERVAL 500   // 2Hz
#define PRESENCE_UPDATE_INTERVAL 1000 // 1Hz
#define LITTLEFS_LOG_INTERVAL 5000  // 0.2Hz