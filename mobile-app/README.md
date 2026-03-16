# SafeHome Smart Villa - App Prototype

## 📱 App Yapısı

```
mobile-app/
├── src/
│   ├── screens/           # Ana ekranlar
│   │   ├── Dashboard.js   # Genel bakış
│   │   ├── Rooms.js      # Oda takibi
│   │   ├── Health.js     # Sağlık monitörü
│   │   ├── Automation.js # Otomasyon
│   │   └── Settings.js   # Ayarlar
│   ├── components/        # UI bileşenler
│   │   ├── RoomCard.js   # Oda kartı
│   │   ├── PersonIcon.js # Kişi ikonu
│   │   ├── AlertCard.js  # Uyarı kartı
│   │   └── StatCard.js   # İstatistik kartı
│   ├── services/          # API servisleri
│   │   ├── api.js        # REST API
│   │   ├── websocket.js  # Real-time
│   │   └── knx.js        # KNX kontrol
│   ├── hooks/             # Custom hooks
│   │   ├── useOccupancy.js
│   │   ├── useHealth.js
│   │   └── useAlerts.js
│   ├── context/           # State yönetimi
│   │   └── AppContext.js
│   └── utils/             # Yardımcılar
│       └── constants.js
├── assets/               # Görseller
└── App.js               # Entry point
```

## 🎨 Ekran Tasarımları

### 1. Dashboard (Ana Ekran)

```
┌─────────────────────────────────────┐
│ ≡  SafeHome            👤 🔔     │
├─────────────────────────────────────┤
│                                     │
│  🏠 Villa Durumu                   │
│  ┌─────────────────────────────────┐│
│  │  🔵 Aktif      🟢 4 Kişi      ││
│  │  ○○○○○                      ││
│  │  [Salon] [Mutfak] [Yatak]    ││
│  │   2 kişi   1 kişi   1 kişi    ││
│  └─────────────────────────────────┘│
│                                     │
│  ⚡ Enerji (Bu Ay)                 │
│  ┌─────────────────────────────────┐│
│  │  ████████████░░░░░░░  342 kWh ││
│  │  Geçen ay: 289 kWh            ││
│  └─────────────────────────────────┘│
│                                     │
│  🚨 Son Bildirimler                │
│  ┌─────────────────────────────────┐│
│  │ 🔴 Düşme Uyarısı - 14:32      ││
│  │    Yatak Odası                 ││
│  │ 🟡 Hareket Yok - 13:00         ││
│  │    Bahçe                       ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  🏠   💓   ⚡   ⚙️                  │
│  Ev  Sağlık Otomasyon Ayarlar     │
└─────────────────────────────────────┘
```

### 2. Rooms (Oda Takibi)

```
┌─────────────────────────────────────┐
│ ←  Oda Takibi                      │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🛋️ SALON                    2 👤││
│  │ ○○○○○  Aktif                  ││
│  │ Son hareket: 2 dk önce         ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🍳 MUTFAK                   1 👤││
│  │ ○○○○○  Aktif                  ││
│  │ Son hareket: 15 dk önce        ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🛏️ YATAK ODASI             1 👤││
│  │ ○○○○○  Aktif                  ││
│  │ Son hareket: Şimdi             ││
│  │ 💓 Nabız: 72 bpm 🟢           ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🚿 BANYO                      0 👤││
│  │ ○○○○○  Boş                    ││
│  │ Son hareket: 1 saat önce       ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🚪 BAHÇE                     0 👤││
│  │ ○○○○○  Boş                    ││
│  │ Son hareket: 13:00             ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  🏠   💓   ⚡   ⚙️                  │
└─────────────────────────────────────┘
```

### 3. Health (Sağlık Monitörü)

```
┌─────────────────────────────────────┐
│ ←  Sağlık Durumu                   │
├─────────────────────────────────────┤
│                                     │
│  👤 Aile Üyeleri                   │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 👴 Dede (Yatak Odası)          ││
│  │ ┌─────────┐  ┌──────────────┐  ││
│  │ │  💓 72  │  │  🫁 14/dk   │  ││
│  │ │  Normal │  │  Normal      │  ││
│  │ └─────────┘  └──────────────┘  ││
│  │                                 ││
│  │ Durum: 🟢 Aktif               ││
│  │ Son hareket: Şimdi            ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 👩 Anne (Salon)                ││
│  │ ┌─────────┐  ┌──────────────┐  ││
│  │ │  💓 68  │  │  🫁 16/dk   │  ││
│  │ │  Normal │  │  Normal      │  ││
│  │ └─────────┘  └──────────────┘  ││
│  │                                 ││
│  │ Durum: 🟢 Aktif               ││
│  │ Son hareket: 5 dk önce        ││
│  └─────────────────────────────────┘│
│                                     │
│  📊 Haftalık Özet                  │
│  ┌─────────────────────────────────┐│
│  │ Ort. Uyku: 7s 24dk      ████░││
│  │ Ort. Hareket: 2.4s/s     ███░░││
│  │ Düşme Sayısı: 0         █████││
│  └─────────────────────────────────┘│
│                                     │
│  🚨 Acil Durum                      │
│  ┌─────────────────────────────────┐│
│  │        🆘 ACIL ARA              ││
│  │   (Tüm aile üyelerine bildirim)││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  🏠   💓   ⚡   ⚙️                  │
└─────────────────────────────────────┘
```

### 4. Automation (Otomasyon)

```
┌─────────────────────────────────────┐
│ ←  Otomasyon Kuralları             │
├─────────────────────────────────────┤
│                                     │
│  + Yeni Kural Ekle                  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟢 Aktif                       ││
│  │ Oda Doluluk → Işık             ││
│  │ "Salon boşalınca ışıkları kapat"││
│  │ ○○○○○○                          ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟢 Aktif                       ││
│  │ Düşme Tespiti → Alarm          ││
│  │ "Düşme algılanırsa bildirim gönder"││
│  │ ○○○○○○                          ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟢 Aktif                       ││
│  │ Gece Modu                      ││
│  │ "23:00-07:00 arası sessiz mod"││
│  │ ○○○○○○                          ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🔴 Pasif                       ││
│  │ Enerji Tasarrufu               ││
│  │ "Oda boş >30dk → HVAC kapat"  ││
│  │ ○○○○○○                          ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  🏠   💓   ⚡   ⚙️                  │
└─────────────────────────────────────┘
```

### 5. Settings (Ayarlar)

```
┌─────────────────────────────────────┐
│ ←  Ayarlar                         │
├─────────────────────────────────────┤
│                                     │
│  👤 Hesap                          │
│  ├─ Profil Düzenle                │
│  ├─ Aile Üyeleri                  │
│  └─ Abonelik Paketi               │
│                                     │
│  🔔 Bildirimler                    │
│  ├─ Push Bildirimler        [AÇIK] │
│  ├─ SMS Uyarıları           [KAPALI]│
│  ├─ Düşme Uyarısı          [AÇIK] │
│  ├─ Hareket Uyarısı          [AÇIK] │
│  └─ Günlük Özet              [AÇIK]│
│                                     │
│  🏠 Ev Ayarları                    │
│  ├─ Oda Düzenle                  │
│  ├─ KNX Cihazları                │
│  ├─ WiFi Sensör Konumu           │
│  └─ Acil Durum Kişileri          │
│                                     │
│  📊 Veri & Gizlilik               │
│  ├─ Veri Saklama            [30 gün]│
│  ├─ Konum Paylaşımı        [AÇIK] │
│  ├─ Sağlık Verileri         [AÇIK] │
│  └─ Veri İndir                   │
│                                     │
│  ❓ Yardım & Destek               │
│  ├─ SSS                           │
│  ├─ İletişim                     │
│  └─ Uygulama Hakkında            │
│                                     │
│  🚪 Çıkış Yap                     │
│                                     │
├─────────────────────────────────────┤
│  🏠   💓   ⚡   ⚙️                  │
└─────────────────────────────────────┘
```

## 🎯 Temel Özellikler (MVP)

| Özellik | Priority | Açıklama |
|---------|----------|----------|
| Oda doluluk | P0 | Oda bazlı kişi sayısı |
| Hareket takibi | P0 | Son hareket zamanı |
| Bildirimler | P0 | Push notification |
| Dashboard | P0 | Genel bakış |
| Sağlık monitörü | P1 | Nabız/nefes (Premium) |
| Düşme tespiti | P1 | Algı → acil bildirim |
| Otomasyon kuralları | P2 | Basit IF-THEN |
| KNX kontrol | P2 | Işık/HVAC |

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI

### Kurulum

```bash
# Projeyi klonla
cd mobile-app

# Bağımlılıkları yükle
npm install

# Development sunucusunu başlat
npm start

# iOS için
npm run ios

# Android için
npm run android
```

### API Yapılandırması

`src/services/api.js` dosyasındaki API URL'ini değiştir:

```javascript
const API_URL = 'http://<GATEWAY_IP>:3000/api/v1';
const WS_URL = 'ws://<GATEWAY_IP>:3000';
```

---

## 📁 Dosya Yapısı

```
mobile-app/
├── App.js                    # Entry point + Navigation
├── package.json              # Bağımlılıklar
├── src/
│   ├── screens/
│   │   ├── Dashboard.js    # Ana ekran
│   │   ├── Rooms.js        # Oda takibi
│   │   ├── Health.js       # Sağlık monitörü
│   │   └── Settings.js      # Ayarlar
│   ├── components/         # UI bileşenler
│   ├── services/           # API, WebSocket
│   ├── hooks/              # Custom hooks
│   └── utils/              # Yardımcı fonksiyonlar
└── assets/                  # Görseller
```

---

## 🎯 Sonraki Adımlar

1. **Backend API** - Node.js backend oluştur
2. **WebSocket** - Real-time veri akışı
3. **Push Notifications** - Bildirim sistemi
4. **Login/Auth** - Kullanıcı girişi
5. **App Store** - Deploy

---

## 📞 İletişim

- Proje: SafeHome Smart Villa
- Teknoloji: WiFi DensePose (MIT License)
