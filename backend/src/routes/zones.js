/**
 * Zones Routes
 * Oda yönetimi endpoint'leri
 */

const express = require('express');
const router = express.Router();

// Apartman dairesi odaları - sensör yerleşimine göre
const rooms = [
  { id: '10', name: 'Calisma Odasi', icon: '\uD83D\uDCBB', csi_node_id: 'csi_1' },  // Aktif sensör burada
  { id: '1',  name: 'Antre',         icon: '\uD83D\uDEAA', csi_node_id: 'csi_2' },   // 2. sensör buraya takılacak
  { id: '2',  name: 'Salon',         icon: '\uD83D\uDECB\uFE0F', csi_node_id: 'csi_3' },
  { id: '3',  name: 'Mutfak',        icon: '\uD83C\uDF73', csi_node_id: 'csi_4' },
  { id: '4',  name: 'Yatak Odasi 1', icon: '\uD83D\uDECF\uFE0F', csi_node_id: 'csi_5' },
  { id: '5',  name: 'Yatak Odasi 2', icon: '\uD83D\uDECF\uFE0F', csi_node_id: 'csi_6' },
  { id: '6',  name: 'Yatak Odasi 3', icon: '\uD83D\uDECF\uFE0F', csi_node_id: 'csi_7' },
  { id: '7',  name: 'Banyo 1',       icon: '\uD83D\uDEBF', csi_node_id: 'csi_8' },
  { id: '8',  name: 'Banyo 2',       icon: '\uD83D\uDEBF', csi_node_id: 'csi_9' },
];

const occupancy = {};

// Get all zones with occupancy
router.get('/', (req, res) => {
  const zonesWithOccupancy = rooms.map(room => ({
    ...room,
    occupancy: occupancy[room.id] || { count: 0, confidence: 0, lastMotion: null, active: false }
  }));
  
  res.json({
    zones: zonesWithOccupancy,
    total_persons: zonesWithOccupancy.reduce((sum, z) => sum + z.occupancy.count, 0)
  });
});

// Get single zone
router.get('/:id', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    ...room,
    occupancy: occupancy[room.id] || { count: 0, confidence: 0, lastMotion: null, active: false }
  });
});

// Get zone occupancy
router.get('/:id/occupancy', (req, res) => {
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    room_id: room.id,
    room_name: room.name,
    ...(occupancy[room.id] || { count: 0, confidence: 0, lastMotion: null, active: false }),
    timestamp: new Date().toISOString()
  });
});

// Update occupancy (called by CSI processor)
router.post('/:id/occupancy', (req, res) => {
  const { count, confidence, activity, lastMotion } = req.body;
  
  if (!rooms.find(r => r.id === req.params.id)) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  occupancy[req.params.id] = {
    count: count || 0,
    confidence: confidence || 0,
    activity: activity || 'idle',
    lastMotion: lastMotion || new Date().toISOString(),
    active: (count || 0) > 0,
    timestamp: new Date().toISOString()
  };
  
  // Broadcast to WebSocket clients
  const wsService = req.app.get('wsService');
  if (wsService) {
    wsService.broadcast({
      type: 'occupancy_update',
      room_id: req.params.id,
      ...occupancy[req.params.id]
    });
  }
  
  // Log to InfluxDB
  const influxService = req.app.get('influxService');
  if (influxService) {
    influxService.writeOccupancy(req.params.id, occupancy[req.params.id]);
  }
  
  res.json({ success: true, occupancy: occupancy[req.params.id] });
});

// Export occupancy store for MQTT bridge to update directly
function updateOccupancy(roomId, data) {
  if (!rooms.find(r => r.id === roomId)) return;
  occupancy[roomId] = {
    count: data.count || 0,
    confidence: data.confidence || 0,
    activity: data.activity || 'idle',
    lastMotion: data.lastMotion || new Date().toISOString(),
    active: (data.count || 0) > 0,
    timestamp: new Date().toISOString()
  };
}

module.exports = router;
module.exports.updateOccupancy = updateOccupancy;
