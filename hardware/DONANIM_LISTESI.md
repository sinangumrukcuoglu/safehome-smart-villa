# SafeHome Smart Villa - Donanım Listesi

*Entegrasyon Sipariş Listesi*

---

## 🏠 Tam Sistem (Villa Başı)

### 1. WiFi CSI Sensörleri (Oda Başı)

| Cihaz | Adet | Birim Fiyat | Toplam | Not |
|--------|------|-------------|--------|-----|
| ESP32-S3 Mini | 5-8 | 500 TL | 2,500-4,000 TL | Oda başı |

> **Not:** ESP32 normal WiFi kullanır (CSI değil). Tam CSI için Atheros AR9580 gerekli.

### 2. Gateway

| Cihaz | Adet | Birim Fiyat | Toplam | Not |
|-------|------|-------------|--------|-----|
| ESP32-WROOM-32 | 1 | 600 TL | 600 TL | Ana gateway |

### 3. KNX Entegrasyonu

| Cihaz | Adet | Birim Fiyat | Toplam | Not |
|-------|------|-------------|--------|-----|
| KNX TP-UART Modülü | 1 | 400 TL | 400 TL | ESP32-KNX köprü |
| KNX Güç Kaynağı | 1 | 300 TL | 300 TL | Bus güç |

### 4. Kablolama & Aksesuar

| Cihaz | Adet | Birim Fiyat | Toplam | Not |
|-------|------|-------------|--------|-----|
| USB Kablo (ESP32) | 6 | 50 TL | 300 TL | Micro-USB |
| Dupont Kablo Set | 1 | 100 TL | 100 TL | Jumper kablolar |
| USB Adaptör (5V/2A) | 6 | 80 TL | 480 TL | Güç kaynağı |
| Kasa/Dikış | 1 | 200 TL | 200 TL | Gateway kutusu |

---

## 💰 Toplam Maliyet

### Minimum (Sadece ESP32)

| Kalem | Tutar |
|-------|-------|
| ESP32 (6 adet) | 3,600 TL |
| Kablolar & Aksesuar | 1,080 TL |
| **Toplam** | **~4,680 TL** |

### Orta (ESP32 + KNX)

| Kalem | Tutar |
|-------|-------|
| ESP32 (7 adet) | 4,200 TL |
| KNX Modül + Güç | 700 TL |
| Kablolar & Aksesuar | 1,280 TL |
| **Toplam** | **~6,180 TL** |

### Tam (Atheros CSI - İleride)

| Kalem | Tutar |
|-------|-------|
| Atheros AR9580 | 500 TL |
| USB Adapter | 200 TL |
| ESP32 (4 adet) | 2,400 TL |
| KNX Modül + Güç | 700 TL |
| Kablolar | 1,000 TL |
| **Toplam** | **~4,800 TL** |

---

## 🛒 Türkiye Satın Alma Linkleri

### ESP32 (Hızlı Kargo)

| Site | Ürün | Fiyat | Link |
|------|------|--------|------|
| **Robotistan** | ESP32-S3 Mini | ~500 TL | [Satın Al](https://www.robotistan.com/esp32-s3-mini-wifi-and-bluetooth-development-board-en) |
| **Robotistan** | ESP32-WROOM-32 | ~570 TL | [Satın Al](https://www.robotistan.com/esp32-wroom-32-wifi-ble-gelistirme-karti) |
| **Amazon TR** | ESP32-WROOM-32 | 570 TL | [Satın Al](https://www.amazon.com.tr) |

### KNX Modülü

| Site | Ürün | Fiyat | Link |
|------|------|--------|------|
| **Direnc.net** | KNX TP-UART | ~400 TL | [Satın Al](https://www.direnc.net) |
| **Robotistan** | KNX Modül | ~450 TL | [Satın Al](https://www.robotistan.com) |

### Kablolar

| Site | Ürün | Fiyat | Link |
|------|------|--------|------|
| **Robotistan** | USB Kablo | ~50 TL | [Satın Al](https://www.robotistan.com) |
| **Robotistan** | Dupont Set | ~100 TL | [Satın Al](https://www.robotistan.com) |

---

## 📋 Sipariş Önerisi (Şimdi)

### Step 1: Temel (MVP)

- [ ] ESP32-WROOM-32 x 3 adet (~1,700 TL)
- [ ] USB Kablo x 3 (~150 TL)
- [ ] USB Adaptör x 3 (~240 TL)
- **Ara Toplam: ~2,090 TL**

### Step 2: KNX Entegrasyon (İleride)

- [ ] KNX TP-UART Modül (~400 TL)
- [ ] KNX Güç Kaynağı (~300 TL)

### Step 3: Tam CSI (İleride)

- [ ] Atheros AR9580 (~500 TL)
- [ ] USB WiFi Adapter (~200 TL)

---

## ⚡ Hızlı Sipariş

En az siparişle başla:

```
1. Robotistan:
   - ESP32-WROOM-32 x 3 = 1,710 TL
   - USB Kablo x 3 = 150 TL
   - USB Adaptör x 3 = 240 TL
   Toplam: ~2,100 TL
```

---

Soruların var mı? Siparişte yardımcı olayım!
