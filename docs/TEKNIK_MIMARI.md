# SafeHome Smart Villa - Teknik Mimari

*Versiyon: 1.0 | Tarih: 2026-03-01*

---

## 🏗️ Sistem Genel Mimarisi

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SafeHome Smart Villa                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │  WiFi CSI    │     │   ESP32      │     │       KNX Bus          │ │
│  │  Sensörleri  │────▶│   Gateway    │◀───▶│  (Işık, HVAC, Priz)    │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────┘ │
│         │                     │                                              │
│         │              ┌──────┴──────┐                                    │
│         │              │             │                                    │
│         │              ▼             ▼                                    │
│         │     ┌────────────┐  ┌────────────┐                             │
│         │     │  Node.js   │  │  WebSocket │                             │
│         │     │    API     │──│  Server    │                             │
│         │     └────────────┘  └────────────┘                             │
│         │            │               │                                    │
│         │            └───────┬───────┘                                    │
│         │                    ▼                                            │
│         │          ┌──────────────────┐                                   │
│         │          │    InfluxDB     │                                   │
│         │          │  (Time-series)  │                                   │
│         │          └──────────────────┘                                   │
│         │                    │                                            │
│         └────────────────────┼─────────────────────────────────────────┘
│                              ▼
│                   ┌────────────────────┐
│                   │    React Native  │
│                   │       App         │
│                   │  (iOS + Android)  │
│                   └────────────────────┘
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Donanım Mimarisi

### 1. WiFi CSI Sensörü

```
┌────────────────────────────────────────┐
│         WiFi CSI Node (Oda Başı)       │
├────────────────────────────────────────┤
│  ESP32-S3                             │
│  ├─ WiFi STA + Promiscuous Mode       │
│  ├─ CSI Extraction (56-192 subcarrier)│
│  ├─ UDP Stream (20Hz)                 │
│  └─ Flash: 4MB                        │
│                                        │
│  Güç: USB-C 5V/500mA                 │
│  Fiyat: ~$8                           │
└────────────────────────────────────────┘
```

| Parametre | Değer |
|-----------|-------|
| MCU | ESP32-S3 |
| WiFi | 2.4/5 GHz |
| CSI Subcarrier | 56-192 |
| Sample Rate | 20 Hz |
| Latency | <100ms |
| Güç | 5V USB |

### 2. Gateway

```
┌────────────────────────────────────────┐
│           SafeHome Gateway              │
├────────────────────────────────────────┤
│  ESP32-WROOM-32                        │
│  ├─ CSI Aggregation                   │
│  ├─ KNX TP-UART Modülü               │
│  ├─ Ethernet (Opsiyonel)              │
│  ├─ WebSocket Server                  │
│  └─ OTA Update                        │
│                                        │
│  KNX Bağlantı:                        │
│  ├─ TP-UART (9600 baud)              │
│  ├─ Group address mapping            │
│  └─ Max 50 cihaz                     │
│                                        │
│  Güç: 12V DC                          │
│  Fiyat: ~$25                          │
└────────────────────────────────────────┘
```

### 3. Donanım Liste (Tek Villa)

| Cihaz | Adet | Birim Fiyat | Toplam |
|-------|------|-------------|--------|
| ESP32-S3 (CSI) | 5-8 | $8 | $40-64 |
| ESP32 Gateway | 1 | $25 | $25 |
| KNX TP-UART | 1 | $15 | $15 |
| USB Kablo | 5-8 | $2 | $10-16 |
| Kasa | 1 | $10 | $10 |
| **Toplam** | | | **$100-140** |

---

## 💾 Yazılım Mimarisi

### Katman 1: Edge (ESP32)

```
┌─────────────────────────────────────────┐
│           ESP32 Firmware                 │
├─────────────────────────────────────────┤
│                                          │
│  ┌─────────────┐   ┌─────────────────┐  │
│  │ CSI Parser  │──▶│ Feature Extract │  │
│  │ (20 Hz)    │   │ (Doppler, RSSI) │  │
│  └─────────────┘   └────────┬────────┘  │
│                              │            │
│                              ▼            │
│  ┌─────────────────────────────────────┐  │
│  │      Edge Processing                │  │
│  ├─ Motion Detection                   │  │
│  ├─ Presence Detection                │  │
│  ├─ Simple Fall Detection             │  │
│  └──────────────┬──────────────────────┘  │
│                 │                          │
│                 ▼                          │
│  ┌─────────────────────────────────────┐  │
│  │    UDP / WebSocket Output           │  │
│  │    (JSON, 20Hz)                     │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Katman 2: Gateway (Node.js)

```
┌─────────────────────────────────────────┐
│           Gateway Service                │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │ CSI Receiver │  │  Pose Estimation │ │
│  │ (UDP/8001)  │──│  (WiFi DensePose)│ │
│  └──────────────┘  └────────┬─────────┘ │
│                              │           │
│                              ▼           │
│  ┌──────────────────────────────────────┐│
│  │       Intelligence Engine            ││
│  │  ├─ Room Occupancy                  ││
│  │  ├─ Activity Recognition            ││
│  │  ├─ Fall Detection                 ││
│  │  ├─ Vital Signs (breath/HR)        ││
│  │  └─ Anomaly Detection              ││
│  └──────────────┬───────────────────────┘│
│                 │                         │
│    ┌────────────┼────────────┐           │
│    ▼            ▼            ▼           │
│ ┌──────┐  ┌────────┐  ┌──────────┐      │
│ │ KNX  │  │InfluxDB│  │ WebSocket │      │
│ │ Ctrl │  │ Writer │  │  Server   │      │
│ └──────┘  └────────┘  └──────────┘      │
└─────────────────────────────────────────┘
```

### Katman 3: Cloud/API

```
┌─────────────────────────────────────────┐
│              REST API                    │
├─────────────────────────────────────────┤
│                                          │
│  GET  /api/v1/zones              → Oda │
│  GET  /api/v1/zones/:id/occupancy→ Dolul│
│  GET  /api/v1/persons             → Kişi │
│  GET  /api/v1/persons/:id/activity→Act.│
│  GET  /api/v1/health             → Sağlık│
│  GET  /api/v1/alerts             →Uyarı │
│  POST /api/v1/automation/rules   →Kural │
│  GET  /api/v1/automation/history→Geçmiş│
│  GET  /api/v1/stats              →İstati │
│                                          │
│  WS   /ws/v1/stream              →Canlı │
└─────────────────────────────────────────┘
```

### Katman 4: Mobile App

```
┌─────────────────────────────────────────┐
│          React Native App                │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │         Ana Ekranlar                │ │
│  │  ├─ Dashboard (genel bakış)        │ │
│  │  ├─ Oda Takibi (oda bazlı)         │ │
│  │  ├─ Sağlık Monitörü               │ │
│  │  ├─ Otomasyon Kuralları           │ │
│  │  ├─ Bildirim Geçmişi              │ │
│  │  └─ Ayarlar                        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │       Real-time Updates             │ │
│  │  ├─ WebSocket (20Hz pose)          │ │
│  │  ├─ Push Notifications              │ │
│  │  └─ Background Location            │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │       Offline Support               │ │
│  │  ├─ Local Cache (MMKV)             │ │
│  │  └─ Queue Actions                   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔄 Veri Akışı

### Senaryo: Oda Doluluk → Işık Kontrolü

```
1. [ESP32-S3] WiFi CSI verisi topla (20 Hz)
            │
            ▼
2. [ESP32-S3] UDP paket olarak gönder
            │
            ▼
3. [Gateway] CSI verisini al
            │
            ▼
4. [Gateway] WiFi DensePose → pose/activity
            │
            ▼
5. [Gateway] Oda doluluk = 1 kişi
            │
            ├──────────────────┐
            ▼                  ▼
6a. [KNX] Işıkları aç    6b. [InfluxDB] Veriyi kaydet
            │                  │
            ▼                  ▼
7. [WebSocket] App'e gönder      │
            │                  │
            ▼                  ▼
8. [App] UI'yi güncelle    9. [Dashboard] Grafik
```

**Latency**: <500ms (CSI → KNX aksiyon)

### Senaryo: Düşme Tespiti

```
1. [ESP32-S3] WiFi CSI (20 Hz)
            │
            ▼
2. [Gateway] Pose estimation
            │
            ▼
3. [Gateway] Ani hız değişimi + yatay pozisyon
            │         │
            │         │ Düşme algılandı!
            ▼         ▼
4. [Gateway] Risk skoru hesapla (>0.8)
            │
            ├──────────────────┐
            ▼                  ▼
5a. [KNX] Işıkları yak      5b. [Push] App bildirim
            │                  │
            │                  ▼
            │           5c. [SMS] Acil kontak
            │
            ▼
6. [InfluxDB] Olayı kaydet
```

---

## 🗄️ Veritabanı Şeması

### InfluxDB (Time-Series)

```python
# Measurement: occupancy
occupancy
├── time: timestamp
├── room_id: string
├── count: integer
├── confidence: float
└── activity: string (idle/walking/sitting/lying)

# Measurement: health
health
├── time: timestamp
├── person_id: string
├── heart_rate: float (opsiyonel)
├── breathing_rate: float (opsiyonel)
├── confidence: float
└── status: string (normal/abnormal)

# Measurement: alerts
alerts
├── time: timestamp
├── type: string (fall/motion/health/security)
├── severity: string (low/medium/high/critical)
├── room_id: string
├── description: string
└── acknowledged: boolean
```

### PostgreSQL (Metadata)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    villa_id UUID,
    role VARCHAR(20), -- owner/admin/member
    created_at TIMESTAMP
);

-- Villas
CREATE TABLE villas (
    id UUID PRIMARY KEY,
    address VARCHAR(500),
    owner_id UUID,
    plan VARCHAR(20), -- security/health/comfort
    status VARCHAR(20), -- active/trial/inactive
    created_at TIMESTAMP
);

-- Rooms
CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    villa_id UUID,
    name VARCHAR(100),
    csi_node_id VARCHAR(50),
    knx_group_address VARCHAR(50)
);

-- Automation Rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY,
    villa_id UUID,
    trigger_type VARCHAR(50),
    trigger_params JSONB,
    action_type VARCHAR(50),
    action_params JSONB,
    enabled BOOLEAN
);
```

---

## 🔐 KNX Entegrasyonu

### Desteklenen Cihazlar

| Tip | Örnek | KNX Group |
|-----|-------|-----------|
| Işık | Dimmer | 0/0/1 - 0/0/8 |
| PRIZ | Aç/Kapa | 0/1/1 - 0/1/8 |
| HVAC | Termostat | 0/2/1 |
| Perde | Motor | 0/3/1 - 0/3/4 |
| Alarm | Siren | 0/4/1 |

### Mapping Kuralları

```javascript
// room_occupancy → light control
{
  trigger: {
    type: "occupancy",
    room: "salon",
    threshold: 1  // 1+ kişi
  },
  action: {
    type: "knx_write",
    group: "0/0/1",
    value: "1"  // Işığı aç
  }
}

// fall_detected → emergency
{
  trigger: {
    type: "alert",
    alert_type: "fall",
    room: "yatak_odasi"
  },
  action: [
    { type: "knx_write", group: "0/4/1", value: "1" },  // Siren
    { type: "notification", priority: "critical" },       // Push
    { type: "sms", to: "+90xxx" }                        // SMS
  ]
}
```

---

## 🔒 Güvenlik

### Veri Güvenliği

- **TLS 1.3**: Tüm iletişimler şifreli
- **JWT**: App autentikasyon
- **Local Storage**: Şifreli (MMKV)
- **Veri Saklama**: Türkiye (local opsiyonel)

### Privacy

- **Kameralar**: Yok
- **Mikrofon**: Yok
- **Konum**: Oda bazlı (tam konum yok)
- **Veri Sahipliği**: Kullanıcı verisi kullanıcının

---

## 📦 Deployment

### Development

```bash
# Backend
cd backend
npm install
npm run dev

# Mobile
cd mobile-app
npm install
npm run ios / npm run android
```

### Production

```bash
# Docker (Backend)
docker build -t safehome/gateway:latest .
docker run -d -p 3000:3000 --network host safehome/gateway

# InfluxDB
docker run -d -p 8086:8086 -v influxdb2:/etc/influxdb2 influxdb:2

# PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=xxx postgres:15
```

---

## ✅ Sonuç

Bu mimari:

- **Modüler**: Kolay genişleme
- **Edge-first**: Düşük latency, offline çalışma
- **KNX uyumlu**: Mevcut sistemlerle entegrasyon
- **Gizlilik-first**: Kamera/mikrofon yok
- **Ölçeklenebilir**: 1 villadan 1000+ villa

---

*Bu dokümantasyon SafeHome Smart Villa projesi için hazırlanmıştır.*
