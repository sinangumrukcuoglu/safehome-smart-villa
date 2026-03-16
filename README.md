# SafeHome Smart Villa

**WiFi CSI-based Smart Home Presence Detection System**

## 📋 Proje Özeti

SafeHome, WiFi Channel State Information (CSI) kullanarak kamerasız insan tespiti yapan akıllı ev sistemidir. ESP32 mikrodenetleyiciler ile WiFi sinyal değişikliklerini analiz ederek oda doluluk, hareket ve kişi sayısı tespiti yapar.

## 🚀 Özellikler

- ✅ **Real-time kişi tespiti** (WiFi CSI ile)
- ✅ **Çoklu ESP32 desteği** (antre, salon, odalar)
- ✅ **MQTT mesajlaşma** (ESP32 → Dashboard)
- ✅ **Web dashboard** (real-time monitoring)
- ✅ **REST API** (programatik erişim)
- ✅ **WiFi DensePose roadmap** (ileri özellikler)

## 🏗️ Sistem Mimarisi

```
ESP32 CSI Nodes → MQTT Broker → Backend API → Web Dashboard
      ↓                ↓              ↓
   WiFi CSI      Mosquitto     Node.js/Express   React/HTML
```

## 📁 Proje Yapısı

```
SafeHome_Smart_Villa/
├── firmware/          # ESP32 firmware (PlatformIO + ESP-IDF)
├── backend/           # Dashboard backend (Node.js + Express)
├── docs/              # Dokümantasyon
├── hardware/          # Devre şemaları
└── scripts/           # Yardımcı script'ler
```

## 🔧 Kurulum

### 1. ESP32 Firmware
```bash
cd firmware
# PlatformIO ile derleme
pio run
# ESP32'ye yükleme
pio run -t upload
```

### 2. Backend (Dashboard)
```bash
cd backend
npm install
npm start
# veya PM2 ile
pm2 start src/index.js --name safehome-dashboard
```

### 3. MQTT Broker (WSL)
```bash
# WSL Ubuntu'da
sudo apt install mosquitto
sudo systemctl start mosquitto
```

## ⚙️ Konfigürasyon

### ESP32 Config (`firmware/src/config.h`)
```cpp
#define WIFI_SSID "grand deco"
#define MQTT_BROKER "192.168.68.107"
#define MOTION_THRESHOLD 0.5  // Kritik optimizasyon
```

### Backend Config (`backend/.env`)
```
PORT=3000
MQTT_BROKER=mqtt://192.168.68.107:1883
```

## 📡 MQTT Topics

| Topic | Açıklama | Format |
|-------|----------|--------|
| `safehome/csi/{node_id}` | CSI ham verisi | JSON |
| `safehome/presence/{node_id}` | Kişi tespiti | JSON |
| `safehome/status/{node_id}` | Cihaz durumu | JSON |

## 🎯 Roadmap

### FAZ 1: Temel Altyapı ✅ (2026-03-16)
- ESP32 firmware with threshold fix (0.5)
- MQTT pipeline + port forwarding
- Basic dashboard

### FAZ 2: CSI Heatmap (Planlanıyor)
- WiFi CSI görselleştirme
- Heatmap overlay

### FAZ 3: Çoklu Kişi Takibi
- Multi-person detection
- Location tracking

### FAZ 4: Poz Tahmini
- Pose estimation (17 keypoints)
- Activity recognition

## 🤝 Katkıda Bulunma

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

Proje Lideri: **Nyx** (AI Research Assistant)  
Kullanıcı: **Tevfik Sinan Gümrükçüoğlu**  
Telegram: @C_nite

---

**Son Güncelleme:** 2026-03-16  
**Versiyon:** 1.0.0  
**Durum:** Aktif Geliştirme