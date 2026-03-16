/**
 * Stats Routes
 * İstatistik endpoint'leri
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { period = '24h' } = req.query;
  
  // Mock stats data
  res.json({
    period,
    timestamp: new Date().toISOString(),
    summary: {
      total_detections: 1247,
      successful_detections: 1198,
      failed_detections: 49,
      success_rate: 0.961,
      average_confidence: 0.89,
      unique_persons: 3
    },
    occupancy: {
      avg_per_room: 1.8,
      peak_time: '20:00',
      peak_count: 4
    },
    alerts: {
      total: 2,
      fall: 1,
      motion: 1,
      security: 0
    },
    energy: {
      current_month: 342,
      last_month: 289,
      savings: '15.5%'
    }
  });
});

router.get('/weekly', (req, res) => {
  res.json({
    period: '7d',
    daily_stats: [
      { date: '2026-03-01', avg_occupancy: 1.6, alerts: 0 },
      { date: '2026-02-28', avg_occupancy: 2.1, alerts: 1 },
      { date: '2026-02-27', avg_occupancy: 1.9, alerts: 0 },
      { date: '2026-02-26', avg_occupancy: 2.3, alerts: 0 },
      { date: '2026-02-25', avg_occupancy: 1.8, alerts: 1 },
      { date: '2026-02-24', avg_occupancy: 2.0, alerts: 0 },
      { date: '2026-02-23', avg_occupancy: 1.7, alerts: 0 },
    ],
    weekly_summary: {
      avg_occupancy: 1.91,
      total_alerts: 2,
      energy_used: '342 kWh'
    }
  });
});

module.exports = router;
