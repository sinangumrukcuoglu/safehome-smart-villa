/**
 * SafeHome Smart Villa - Backend API
 * Main Server Entry Point
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Routes
const zonesRouter = require('./routes/zones');
const personsRouter = require('./routes/persons');
const healthRouter = require('./routes/health');
const alertsRouter = require('./routes/alerts');
const automationRouter = require('./routes/automation');
const statsRouter = require('./routes/stats');

// Services
const { WebSocketService } = require('./services/websocket');
const { KNXService } = require('./services/knx');
const { InfluxService } = require('./services/influx');
const { MQTTBridge } = require('./services/mqtt');

const app = express();
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocket.Server({ server, path: '/ws' });

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Static files (dashboard)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Initialize Services
const wsService = new WebSocketService(wss);
const knxService = new KNXService();
const influxService = new InfluxService();
const mqttBridge = new MQTTBridge(wsService);

// Connect MQTT bridge to zones occupancy store
const { updateOccupancy } = require('./routes/zones');
mqttBridge.setOccupancyUpdater(updateOccupancy);

// Make services available to routes
app.set('wsService', wsService);
app.set('knxService', knxService);
app.set('influxService', influxService);
app.set('mqttBridge', mqttBridge);

// API Routes
app.use('/api/v1/zones', zonesRouter);
app.use('/api/v1/persons', personsRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/alerts', alertsRouter);
app.use('/api/v1/automation', automationRouter);
app.use('/api/v1/stats', statsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint - serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API info endpoint for programmatic access
app.get('/api', (req, res) => {
  res.json({
    name: 'SafeHome API',
    version: '1.0.0',
    endpoints: {
      zones: '/api/v1/zones',
      persons: '/api/v1/persons',
      health: '/api/v1/health',
      alerts: '/api/v1/alerts',
      automation: '/api/v1/automation',
      stats: '/api/v1/stats',
      websocket: 'ws://host:port/ws'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   SafeHome Smart Villa API Server                ║
║   Version: 1.0.0                                ║
╠═══════════════════════════════════════════════════╣
║   HTTP:   http://localhost:${PORT}                ║
║   WebSocket: ws://localhost:${PORT}/ws            ║
║   Health:  http://localhost:${PORT}/health        ║
╚═══════════════════════════════════════════════════╝
  `);
  
  // Initialize KNX connection
  knxService.connect().catch(err => {
    console.log('KNX not connected (optional):', err.message);
  });

  // Initialize MQTT bridge (optional - for ESP32 CSI data)
  mqttBridge.connect().catch(err => {
    console.log('MQTT not connected (optional):', err.message);
  });
});

module.exports = { app, server, wsService };
