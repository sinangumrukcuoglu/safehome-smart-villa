# SafeHome WiFi CSI Projesi - Yol Haritası
*WiFi DensePose Tabanlı Kamerasız Akıllı Ev Sistemi*

**Lider:** Nyx (AI Research Assistant)  
**Başlangıç Tarihi:** 2026-03-16  
**Vizyon:** WiFi sinyalleriyle insan/hayvan hareketlerini grafiksel olarak takip eden, gizlilik dostu akıllı ev sistemi

---

## 🎯 VİZYON
**SafeHome Pro** - WiFi CSI tabanlı, kamerasız, gizlilik dostu akıllı ev ve sağlık izleme sistemini **ticari bir ürün olarak pazara sunmak**. "Anahtar teslim" abonelik modeliyle, hardware kitleriyle beraber, hem DIY (kendi kurulum) hem de profesyonel kurulum seçenekleriyle, KNX entegrasyonlu ve KNX'siz versiyonlarıyla son kullanıcıya ulaştırmak.

---

## 📊 FAZLAR

### **FAZ 1: TEMEL ALTYAPI** ✅ *(Tamamlanma: 2026-03-16)*
- [x] ESP32 CSI firmware (threshold fix: 10.0 → 0.5)
- [x] WSL Mosquitto MQTT broker kurulumu
- [x] Port forwarding (Windows 192.168.68.107:1883 → WSL 172.18.13.78:1883)
- [x] Backend/Node.js API (port 3000)
- [x] Dashboard temel UI (http://localhost:3000/)
- [x] Antre'de tek ESP32 testi (başarılı)
- [x] Temel motion detection + kişi sayısı

**Durum:** ✅ ÇALIŞIYOR  
**ESP32:** XIAO ESP32-S3, node_id: 1, Antre'de  
**Metrikler:** RSSI: -52 dBm, Motion: 0.9, Amplitude: 26.1 dB

### **FAZ 2: GELİŞMİŞ DETECTION** 🔄 *(Hedef: 2026-03-23)*
- [ ] **CSI Heatmap Visualization** - Real-time subcarrier amplitude görselleştirme
- [ ] **Multi-person counting** - 1 → N kişi tespiti
- [ ] **Lokasyon tespiti** - x,y koordinatları (kat planı üzerinde)
- [ ] **Hareket vektörü** - Yön + hız analizi
- [ ] **Activity classification** - Oturma/ayakta/yürüme ayırt etme
- [ ] **İkinci ESP32** - Salon için deployment

**Teknik Hedefler:**
- Dashboard'da WebGL tabanlı CSI heatmap
- 2+ ESP32 ile multi-room coverage
- Kalibrasyon optimizasyonu (confidence > 90%)

### **FAZ 3: POSE ESTIMATION** 🎯 *(Hedef: 2026-04-13)*
- [ ] **WiFi DensePose 17 keypoints** - 2D skeleton rendering
- [ ] **Multi-ESP32 fusion** - Triangulation ile daha kesin lokasyon
- [ ] **Historical analytics** - Timeline playback + trend analizi
- [ ] **Zone alerts** - Bölge bazlı giriş/çıkış uyarıları
- [ ] **Anomaly detection** - Alışılmadık hareket pattern'leri

**Teknik Hedefler:**
- Edge ML (TinyML) on ESP32
- Advanced CSI signal processing
- Real-time pose estimation pipeline

### **FAZ 4: FULLY AUTONOMOUS** 🌟 *(Hedef: 2026-06-01)*
- [ ] **3D tracking** - Derinlik + yükseklik tespiti
- [ ] **Edge ML inference optimizasyonu** - Düşük güç tüketimi
- [ ] **Multi-modal fusion** - KNX + diğer sensor entegrasyonu
- [ ] **Predictive maintenance** - Sensor sağlık monitoring
- [ ] **Cloud sync + mobile app** - Remote monitoring

### **FAZ 5: VITAL SIGN PILOT** 🫀 *(Hedef: 2026-07-01)*
- [ ] **Heart rate detection POC** - WiFi CSI ile kalp atışı tespiti (BPM)
- [ ] **Respiration rate testing** - Solunum hızı ölçümü (static position)
- [ ] **Accuracy calibration** - Medical device ile karşılaştırmalı kalibrasyon
- [ ] **Privacy safeguards implementation** - Explicit consent, data encryption
- [ ] **Static vital sign dashboard** - Temel BPM/respiration görselleştirme

**Teknik Hedefler:**
- Micro-Doppler analysis implementation
- Phase-based respiration detection
- Frequency domain signal processing
- >80% accuracy vs. medical reference

### **FAZ 6: PRODUCTION HEALTH MONITORING** 🏥 *(Hedef: 2026-09-01)*
- [ ] **Multi-person vital tracking** - Aile üyeleri ayrı ayrı takip
- [ ] **Sleep quality analytics** - Uyku süresi, kalitesi, REM/NREM cycles
- [ ] **Historical health trends** - Günlük/haftalık/aylık vital sign trendleri
- [ ] **Activity-vital correlation** - Hareket ile vital sign ilişkisi analizi
- [ ] **Wellness dashboard** - Sağlık skoru, öneriler, insights

**Teknik Hedefler:**
- Multi-person CSI separation algorithms
- Long-term vital sign baselines
- Anomaly detection for health events
- HIPAA/GDPR compliant data handling

### **FAZ 7: PREDICTIVE HEALTH INSIGHTS** 🧠 *(Hedef: 2026-12-01)*
- [ ] **Early warning system** - Anormal vital pattern'leri tespit ve uyarı
- [ ] **Wellness recommendations** - AI-driven sağlık önerileri
- [ ] **Doctor/healthcare integration** - Healthcare provider API entegrasyonu (with consent)
- [ ] **Long-term health baselines** - Kişiye özel sağlık profili oluşturma
- [ ] **Predictive analytics** - Trendlere dayalı sağlık tahminleri

**Teknik Hedefler:**
- Machine learning for health prediction
- Integration with wearables/other health devices
- Secure health data sharing protocols
- Clinical validation studies

### **FAZ 8: PRODUCTIZATION** 🏭 *(Hedef: 2026-03-01)*
- [ ] **MVP Definition** - Minimum Viable Product özellikleri
- [ ] **Hardware sourcing** - ESP32-S3 bulk purchase, PCB design
- [ ] **Manufacturing setup** - Assembly, testing, quality control
- [ ] **Packaging design** - Retail ready packaging, unboxing experience
- [ ] **Documentation** - User manuals, quick start guides, troubleshooting
- [ ] **Certifications** - FCC, CE, RoHS compliance
- [ ] **Pricing strategy** - Hardware cost analysis, margin calculation

**Ticari Hedefler:**
- Bill of Materials (BOM) under $150/kit
- Manufacturing capacity: 100 units/month
- Retail price point: $499 (Basic), $1,299 (Pro)
- Break-even analysis: 6-9 months

### **FAZ 9: COMMERCIALIZATION** 💼 *(Hedef: 2026-06-01)*
- [ ] **Sales platform** - E-commerce website, payment processing
- [ ] **Marketing materials** - Product demos, videos, case studies
- [ ] **Distribution channels** - Retail partners, KNX installers, healthcare providers
- [ ] **Support system** - Ticketing, knowledge base, community forum
- [ ] **Subscription management** - SaaS platform, billing, user accounts
- [ ] **Partner ecosystem** - Developer API, integration partners

**Ticari Hedefler:**
- First 100 customers
- $50k+ revenue in first quarter
- 3+ distribution partners
- Customer satisfaction > 4.5/5

### **FAZ 10: SCALING** 🚀 *(Hedef: 2026-09-01)*
- [ ] **Manufacturing scale-up** - 1000+ units/month capacity
- [ ] **International expansion** - EU, US markets, localization
- [ ] **Enterprise features** - Multi-site management, white-label solutions
- [ ] **App store** - Third-party integrations, plugin ecosystem
- [ ] **Advanced analytics** - Business intelligence, customer insights
- [ ] **Strategic partnerships** - OEM deals, technology licensing

**Ticari Hedefler:**
- $1M+ annual revenue
- 10,000+ active users
- International presence (3+ countries)
- Profitable unit economics

---

## 🏗️ TEKNİK MİMARİ

### **Hardware Stack:**
- **ESP32-S3** (CSI capable) × N adet
- **WSL Ubuntu** (Mosquitto MQTT broker)
- **Windows Host** (Port forwarding + dashboard hosting)
- **KNX IP Gateway** (Port 3671) - İleri entegrasyon

### **Software Stack:**
- **Firmware:** ESP-IDF + PlatformIO + C++
- **Backend:** Node.js + WebSocket + MQTT client
- **Frontend:** React + WebGL (Three.js/D3.js) + Real-time updates
- **ML:** TensorFlow Lite (edge inference), Python (training)
- **Database:** SQLite (local), PostgreSQL (cloud sync)

### **Data Pipeline:**
```
ESP32 (CSI 20Hz) 
  → MQTT (safehome/csi/{node_id})
  → Backend (WebSocket bridge)  
  → Dashboard (Real-time rendering)
  → Database (Historical storage)
```

---

## 🧠 LİDERLİK PRENSİPLERİ (Nyx)

1. **Incremental Development:** Küçük, test edilebilir adımlarla ilerle
2. **User-Centric Design:** Dashboard kullanıcı dostu, grafiksel, anlaşılır
3. **Privacy by Design:** Kamerasız, WiFi CSI tabanlı (gizlilik dostu)
4. **Scalable Architecture:** 1 ESP32 → N ESP32, tek oda → tüm ev
5. **Open Source Alignment:** WiFi DensePose community + ekosistem takip
6. **Documentation Driven:** Her adım dokümante edilecek, kararlar kaydedilecek

---

## 📈 ÖLÇÜLEBİLİR HEDEFLER

### **Kısa Vadeli (1 Hafta):**
- [ ] Threshold fix tamamlandı ve test edildi (motion > 0.5 algılanıyor)
- [ ] İkinci ESP32 programlandı ve Salon'a kuruldu
- [ ] Dashboard'da temel CSI heatmap POC çalışıyor
- [ ] Confidence score > 85% kalibrasyon

### **Orta Vadeli (1 Ay):**
- [ ] Multi-person detection çalışıyor (2+ kişi ayrı ayrı tespit)
- [ ] Lokasyon tespiti (x,y) kat planı üzerinde gösteriliyor
- [ ] Historical timeline + playback özelliği
- [ ] 3+ ESP32 multi-room coverage

### **Uzun Vadeli (3-6 Ay):**
- [ ] WiFi DensePose 17 keypoints implementasyonu
- [ ] 3D tracking (derinlik + yükseklik)
- [ ] Mobile app + push notifications
- [ ] KNX entegrasyonu (ışık/ısıtma otomasyonu)
- [ ] Vital sign monitoring POC (kalp atışı, solunum)
- [ ] Health & wellness dashboard integration

---

## 🗂️ PROJE ORGANİZASYONU

**Ana Dizin:** `C:\Users\info\clawd\ARAŞTIRMA_KONULARI_VE_PROJELERİ\SafeHome_Smart_Villa\`

```
SafeHome_Smart_Villa/
├── firmware/           # ESP32 kodu (PlatformIO)
│   ├── src/           # Source files
│   ├── include/       # Header files
│   └── platformio.ini # Build config
├── backend/           # Node.js API
│   ├── src/
│   ├── package.json
│   └── .env
├── dashboard/         # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── docs/              # Dokümantasyon
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── tests/             # Testler
│   ├── unit/
│   └── integration/
└── tools/             # Yardımcı script'ler
```

---

## 🔄 GÜNCEL DURUM (2026-03-16)

**Aktif Çalışmalar:**
1. **Claude Code:** ESP32 firmware threshold fix (10.0 → 0.5)
2. **Sistem:** Çalışıyor (ESP32 → MQTT → Backend → Dashboard)
3. **Test:** Antre'de başarılı (hareket algılanıyor, kişi sayısı tespit ediliyor)

**Sonraki Acil Adımlar:**
1. Claude Code firmware fix'i tamamlansın
2. ESP32 tekrar flash edilsin
3. Yeni threshold (0.5) test edilsin
4. İkinci ESP32 programlansın (Salon)

---

## 📝 KARAR KAYITLARI

### **2026-03-16 Kararları:**
1. **WiFi DensePose merkezi teknoloji** olarak benimsendi
2. **Privacy-first approach:** Kamera yerine WiFi CSI
3. **Incremental roadmap** 4 fazlı plan onaylandı
4. **Dashboard vizyonu:** Tüm WiFi DensePose özellikleri kendi UI'mızda

### **Teknik Kararlar:**
- **MQTT Broker:** WSL Mosquitto (port forwarding ile)
- **ESP32 Model:** XIAO ESP32-S3 (CSI capable)
- **Backend:** Node.js + WebSocket (real-time)
- **Frontend:** React + WebGL (advanced visualization)

---

## 🚨 RİSKLER & MITIGATION

| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|------------|
| CSI sinyal kalitesi | Orta | Yüksek | Multi-ESP32, kalibrasyon optimizasyonu |
| WiFi interference | Yüksek | Orta | Channel hopping, noise filtering |
| ESP32 donanım sorunu | Düşük | Yüksek | Yedek ESP32, failover mekanizması |
| MQTT broker stability | Düşük | Yüksek | Health monitoring, auto-restart |
| Dashboard performance | Orta | Orta | WebGL optimization, data sampling |

---

**Son Güncelleme:** 2026-03-16 (Ticari Ürün Fazları Eklendi)  
**Güncelleyen:** Nyx (Project Leader)  
**Durum:** FAZ 1 ✅ ACTIVE (Teknoloji POC) | FAZ 2-7 🔄 PLANNING | FAZ 8-10 🏭 TİCARİ ÜRÜN