# SafeHome Backend API

## Kurulum

```bash
cd backend
npm install
npm start
```

## API Endpoints

### Zones (Odalar)
```
GET  /api/v1/zones                 # Tüm odalar
GET  /api/v1/zones/:id             # Tek oda
GET  /api/v1/zones/:id/occupancy   # Oda doluluk
POST /api/v1/zones/:id/occupancy   # Doluluk güncelle
```

### Persons (Kişiler)
```
GET  /api/v1/persons              # Tüm kişiler
GET  /api/v1/persons/:id           # Tek kişi
GET  /api/v1/persons/:id/activity # Kişi aktivitesi
POST /api/v1/persons/:id/health   # Sağlık verisi güncelle
```

### Health (Sağlık)
```
GET  /api/v1/health               # Sağlık durumu
GET  /api/v1/health/vitals        # Vital signs
```

### Alerts (Bildirimler)
```
GET  /api/v1/alerts               # Tüm bildirimler
POST /api/v1/alerts               # Yeni bildirim
POST /api/v1/alerts/:id/ack       # Bildirim onayla
```

### Automation (Otomasyon)
```
GET    /api/v1/automation/rules   # Kurallar
POST   /api/v1/automation/rules   # Kural oluştur
PUT    /api/v1/automation/rules/:id
DELETE /api/v1/automation/rules/:id
POST   /api/v1/automation/rules/:id/toggle
```

### Stats (İstatistik)
```
GET  /api/v1/stats                # Genel istatistik
GET  /api/v1/stats/weekly         # Haftalık istatistik
```

## WebSocket

Real-time güncellemeler için:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data);
};
```

## WebSocket Mesajları

- `occupancy_update` - Oda doluluk değişimi
- `health_update` - Sağlık verisi değişimi
- `new_alert` - Yeni bildirim
- `pose_update` - Poz verisi

## Ortam Değişkenleri

```env
PORT=3000
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-token
KNX_IP=192.168.1.100
KNX_PORT=3671
```
