/**
 * Persons Routes
 * Kişi takibi endpoint'leri
 */

const express = require('express');
const router = express.Router();

const persons = [
  { id: '1', name: 'Dede', relation: 'Babaannem', room_id: '3', avatar: '👴', status: 'active' },
  { id: '2', name: 'Anne', relation: 'Eşim', room_id: '1', avatar: '👩', status: 'active' },
  { id: '3', name: 'Baba', relation: 'Ben', room_id: '3', avatar: '👨', status: 'active' },
];

const healthData = {};

// Get all persons
router.get('/', (req, res) => {
  const personsWithHealth = persons.map(p => ({
    ...p,
    health: healthData[p.id] || null
  }));
  res.json({ persons: personsWithHealth });
});

// Get single person
router.get('/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id);
  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }
  res.json({ ...person, health: healthData[person.id] || null });
});

// Get person activity
router.get('/:id/activity', (req, res) => {
  const person = persons.find(p => p.id === req.params.id);
  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }
  res.json({
    person_id: person.id,
    person_name: person.name,
    room_id: person.room_id,
    activity: 'walking',
    timestamp: new Date().toISOString()
  });
});

// Update health data
router.post('/:id/health', (req, res) => {
  const { heart_rate, breathing_rate, confidence, status } = req.body;
  
  if (!persons.find(p => p.id === req.params.id)) {
    return res.status(404).json({ error: 'Person not found' });
  }
  
  healthData[req.params.id] = {
    heart_rate: heart_rate || null,
    breathing_rate: breathing_rate || null,
    confidence: confidence || 0,
    status: status || 'normal',
    timestamp: new Date().toISOString()
  };
  
  // Broadcast to WebSocket
  const wsService = req.app.get('wsService');
  if (wsService) {
    wsService.broadcast({
      type: 'health_update',
      person_id: req.params.id,
      ...healthData[req.params.id]
    });
  }
  
  res.json({ success: true, health: healthData[req.params.id] });
});

module.exports = router;
