# SafeHome Smart Villa - Proje Dosyası

*Oluşturulma: 2026-03-01*
*Versiyon: 0.1*

---

## 📋 Proje Özeti

**Proje Adı:** SafeHome Smart Villa  
**Konsept:** WiFi CSI tabanlı akıllı ev sistemi  
**Hedef:** Müteahhitler ve villa sahiplerine abonelik modeli ile satış  
**Teknoloji:** WiFi DensePose (MIT) + KNX + ESP32

---

## 🏗️ Teknik Mimari

### Donanım

- **WiFi CSI Sensörü**: Atheros AR9580 / ESP32-S3 Mesh
- **Gateway**: ESP32 + KNX modülü
- **Kurulum**: Tavan arası / Gizli montaj

### Yazılım

- **Backend**: Node.js + InfluxDB (time-series)
- **App**: React Native (iOS + Android)
- **API**: REST + WebSocket (real-time)
- **Entegrasyon**: KNX TP-Link / Bosch

---

## 💰 Fiyatlandırma

| Paket | Fiyat | Özellikler |
|-------|-------|------------|
| Temel | ₺2,500/yıl | Doluluk + Işık/HVAC otomasyonu |
| Premium | ₺5,000/yıl | + Düşme tespiti + Sağlık monitörü |
| Pro | Özel | + Kişi tanıma + Enerji optimizasyonu |

---

## 📁 Klasör Yapısı

```
SafeHome/
├── docs/               # Dokümantasyon
├── hardware/           # Donanım şemaları
├── firmware/           # ESP32 kodları
├── backend/           # Node.js API
├── mobile-app/         # React Native
├── knx-integration/    # KNX modülleri
└── legal/             # Sözleşmeler
```

---

## ✅ TODO

- [x] Detaylı iş planı ✅
- [x] Teknik mimari ✅
- [x] App prototype ✅
- [x] Backend API ✅
- [ ] Donanım prototype
- [ ] Entegrasyon testi
- [ ] Pilot kurulum

---

## 📌 Notlar

- WiFi DensePose MIT License altında
- Ticari kullanım serbest
