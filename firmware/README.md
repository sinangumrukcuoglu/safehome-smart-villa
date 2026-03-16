# SafeHome ESP32 CSI Firmware

WiFi CSI tabanlı hareket ve kişi tespiti için ESP32-S3 firmware'i.

## Özellikler

- ✅ WiFi CSI (Channel State Information) ile insan tespiti
- ✅ Kamerasız, gizlilik dostu
- ✅ Real-time motion scoring
- ✅ MQTT ile veri yayınlama
- ✅ FreeRTOS tabanlı multi-task mimari

## Kurulum

### Gereksinimler

- PlatformIO CLI v6.1+
- ESP-IDF framework
- XIAO ESP32-S3 board

### Flash Talimatları

1. ESP32'yi USB üzerinden bilgisayara bağlayın
2. Terminalde firmware dizinine gidin:
   ```bash
   cd C:\Users\info\clawd\ARAŞTIRMA_KONULARI_VE_PROJELERİ\SafeHome_Smart_Villa\firmware
   ```

3. Firmware'i derleyin ve yükleyin:
   ```bash
   pio run -t upload
   ```

4. Serial monitor'ü başlatın:
   ```bash
   pio device monitor
   ```

## MQTT Topics

- `safehome/csi/1`: CSI metrikleri (amplitude, variance, motion)
- `safehome/presence/1`: Presence durumu (count, confidence, presence)
- `safehome/status/1`: Sistem durumu (RSSI, uptime, errors)

## Kritik Threshold Düzeltmeleri

| Parametre | Eski | Yeni | Açıklama |
|-----------|------|------|----------|
| MOTION_THRESHOLD | 10.0 | **0.5** | Motion 0.35 artık algılanacak |
| MOTION_NOISE_FLOOR | yok | 0.3 | 0.13 gürültü filtrelendi |
| VARIANCE_THRESHOLD | yok | 0.5 | Boş oda tespiti |
| MOTION_SCALE_FACTOR | yok | 3.0 | Dashboard uyumu |
| CALIBRATION_FRAMES | yok | 200 | 10sn boot baseline |

## Dashboard

Firmware flash edildikten sonra dashboard'a erişin:
- **URL:** http://localhost:3000/
- **CSI Metrikleri:** Amplitude, Motion, Presence, RSSI
- **Real-time hareket haritası**

## Sorun Giderme

### ESP32 tanınmıyorsa:
1. USB kablosunu değiştirin
2. Farklı USB port deneyin
3. BOOT + RESET tuşlarına basıp bırakın

### WiFi bağlanamıyorsa:
1. `config.h` dosyasında SSID/password kontrol edin
2. Router güçlü sinyal veriyor mu kontrol edin

### MQTT bağlanamıyorsa:
1. WSL Mosquitto çalışıyor mu kontrol edin:
   ```bash
   ssh 172.18.13.78 "sudo systemctl status mosquitto"
   ```
2. Port forwarding aktif mi kontrol edin:
   ```bash
   netsh interface portproxy show all
   ```