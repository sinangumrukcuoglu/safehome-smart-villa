/**
 * Health Routes
 * Sağlık verileri endpoint'leri
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Health endpoint - use /persons/:id/health for detailed data'
  });
});

router.get('/vitals', (req, res) => {
  // Real vitals come via MQTT/WebSocket - no mock data
  res.json({
    timestamp: new Date().toISOString(),
    persons: []
  });
});

module.exports = router;
