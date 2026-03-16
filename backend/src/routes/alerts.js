/**
 * Alerts Routes
 * Uyarı/bildirim endpoint'leri
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const alerts = [];

// Get all alerts
router.get('/', (req, res) => {
  const { severity, acknowledged, limit = 10 } = req.query;
  
  let filtered = [...alerts];
  
  if (severity) filtered = filtered.filter(a => a.severity === severity);
  if (acknowledged !== undefined) filtered = filtered.filter(a => a.acknowledged === (acknowledged === 'true'));
  
  res.json({
    alerts: filtered.slice(0, parseInt(limit)),
    total: filtered.length
  });
});

// Get alert by ID
router.get('/:id', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
});

// Create new alert
router.post('/', (req, res) => {
  const { type, severity, message, room_id } = req.body;
  
  const newAlert = {
    id: uuidv4(),
    type: type || 'info',
    severity: severity || 'medium',
    message: message || '',
    room_id: room_id || null,
    timestamp: new Date().toISOString(),
    acknowledged: false
  };
  
  alerts.unshift(newAlert);
  
  // Broadcast to WebSocket
  const wsService = req.app.get('wsService');
  if (wsService) {
    wsService.broadcast({ type: 'new_alert', alert: newAlert });
  }
  
  res.status(201).json(newAlert);
});

// Acknowledge alert
router.post('/:id/acknowledge', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  
  alert.acknowledged = true;
  alert.acknowledged_at = new Date().toISOString();
  
  res.json({ success: true, alert });
});

module.exports = router;
