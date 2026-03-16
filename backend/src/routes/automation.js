/**
 * Automation Routes
 * Otomasyon kuralları endpoint'leri
 */

const express = require('express');
const router = express.Router();

const automationRules = [
  {
    id: '1',
    name: 'Oda Doluluk → Işık',
    description: 'Salon boşalınca ışıkları kapat',
    trigger: { type: 'occupancy', room_id: '1', threshold: 0 },
    action: { type: 'knx_write', group: '0/0/1', value: '0' },
    enabled: true
  },
  {
    id: '2',
    name: 'Düşme Tespiti → Alarm',
    description: 'Düşme algılanırsa bildirim gönder',
    trigger: { type: 'alert', alert_type: 'fall' },
    action: { type: 'notification', priority: 'critical' },
    enabled: true
  },
  {
    id: '3',
    name: 'Gece Modu',
    description: '23:00-07:00 arası sessiz mod',
    trigger: { type: 'time', start: '23:00', end: '07:00' },
    action: { type: 'knx_write', group: '0/4/1', value: '0' },
    enabled: true
  },
  {
    id: '4',
    name: 'Enerji Tasarrufu',
    description: 'Oda boş >30dk → HVAC kapat',
    trigger: { type: 'occupancy', room_id: 'all', threshold: 0, duration: 1800000 },
    action: { type: 'knx_write', group: '0/2/1', value: '0' },
    enabled: false
  },
];

// Get all rules
router.get('/rules', (req, res) => {
  res.json({ rules: automationRules });
});

// Get rule by ID
router.get('/rules/:id', (req, res) => {
  const rule = automationRules.find(r => r.id === req.params.id);
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  res.json(rule);
});

// Create new rule
router.post('/rules', (req, res) => {
  const { name, description, trigger, action, enabled } = req.body;
  
  const newRule = {
    id: Date.now().toString(),
    name: name || 'New Rule',
    description: description || '',
    trigger: trigger || {},
    action: action || {},
    enabled: enabled !== false
  };
  
  automationRules.push(newRule);
  res.status(201).json(newRule);
});

// Update rule
router.put('/rules/:id', (req, res) => {
  const rule = automationRules.find(r => r.id === req.params.id);
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  
  Object.assign(rule, req.body);
  res.json(rule);
});

// Toggle rule
router.post('/rules/:id/toggle', (req, res) => {
  const rule = automationRules.find(r => r.id === req.params.id);
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  
  rule.enabled = !rule.enabled;
  res.json({ success: true, enabled: rule.enabled });
});

// Delete rule
router.delete('/rules/:id', (req, res) => {
  const index = automationRules.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  
  automationRules.splice(index, 1);
  res.json({ success: true });
});

module.exports = router;
