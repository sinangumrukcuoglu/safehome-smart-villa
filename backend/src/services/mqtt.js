/**
 * MQTT Bridge Service
 * ESP32 CSI verisini MQTT'den alip WebSocket'e aktarir
 * WiFi DensePose compatible topic format:
 *   safehome/csi/<node_id>      → CSI amplitude/variance summary
 *   safehome/presence/<node_id> → Occupancy/presence detection
 *   safehome/status/<node_id>   → Device heartbeat
 *   safehome/health/<person_id> → Health vitals
 *   safehome/alert/<type>       → Alert events
 */

// Node ID → Room ID mapping (CSI node placement)
// Sensör fiziksel konumuna göre eşleştirme
const NODE_TO_ROOM = {
  '1': '1',   // csi_node_01 → Antre (şu anda Antre'de)
  '2': '2',   // csi_node_02 → Salon (ikinci sensör buraya takılacak)
  '3': '3',   // csi_node_03 → Mutfak
  '4': '4',   // csi_node_04 → Yatak Odasi 1
  '5': '5',   // csi_node_05 → Yatak Odasi 2
  '6': '6',   // csi_node_06 → Yatak Odasi 3
  '7': '7',   // csi_node_07 → Banyo 1
  '8': '8',   // csi_node_08 → Banyo 2
  '9': '10',  // csi_node_09 → Çalışma Odası (boşta)
};

class MQTTBridge {
  constructor(wsService) {
    this.wsService = wsService;
    this.client = null;
    this.connected = false;
    this.espNodes = {};  // Track connected ESP32 nodes
  }

  async connect(brokerUrl) {
    const url = brokerUrl || process.env.MQTT_BROKER || 'mqtt://YOUR_MQTT_BROKER_IP:1883';

    let mqtt;
    try {
      mqtt = require('mqtt');
    } catch (e) {
      console.log('MQTT module not available, bridge disabled');
      return;
    }

    try {
      this.client = mqtt.connect(url, {
        clientId: `safehome_backend_${Date.now()}`,
        reconnectPeriod: 5000,
        connectTimeout: 10000
      });

      this.client.on('connect', () => {
        this.connected = true;
        console.log(`MQTT connected: ${url}`);
        this.client.subscribe('safehome/#', (err) => {
          if (err) console.error('MQTT subscribe error:', err);
          else console.log('MQTT subscribed: safehome/#');
        });
      });

      this.client.on('message', (topic, payload) => {
        this.handleMessage(topic, payload);
      });

      this.client.on('error', (err) => {
        console.error('MQTT error:', err.message);
      });

      this.client.on('close', () => {
        this.connected = false;
      });

      this.client.on('offline', () => {
        this.connected = false;
      });
    } catch (err) {
      console.log('MQTT connection failed (optional):', err.message);
    }
  }

  handleMessage(topic, payload) {
    try {
      const parts = topic.split('/');
      // parts[0] = "safehome", parts[1] = type, parts[2] = id
      const msgType = parts[1];
      const sourceId = parts[2];
      const payloadStr = payload.toString();
      let data;

      try {
        data = JSON.parse(payloadStr);
      } catch {
        data = { raw: payloadStr };
      }

      switch (msgType) {
        case 'csi':
          this.handleCSI(sourceId, data);
          break;
        case 'presence':
          this.handlePresence(sourceId, data);
          break;
        case 'status':
          this.handleStatus(sourceId, data);
          break;
        case 'health':
          this.handleHealth(sourceId, data);
          break;
        case 'alert':
          this.handleAlert(sourceId, data);
          break;
        default:
          this.wsService.broadcast({
            type: 'mqtt_message',
            topic,
            data,
            timestamp: new Date().toISOString()
          });
      }
    } catch (err) {
      console.error('MQTT message parse error:', err.message);
    }
  }

  handleCSI(nodeId, data) {
    // Forward CSI data to dashboard for waveform chart
    this.wsService.broadcast({
      type: 'csi_data',
      node_id: nodeId,
      room_id: NODE_TO_ROOM[nodeId] || nodeId,
      amplitude: data.amplitude,
      variance: data.variance,
      rssi: data.rssi,
      subcarriers: data.subcarriers,
      motion: data.motion,
      frames: data.frames,
      timestamp: new Date().toISOString()
    });
  }

  handlePresence(nodeId, data) {
    const roomId = NODE_TO_ROOM[nodeId] || nodeId;

    // Broadcast as occupancy_update (dashboard expects this type)
    this.wsService.broadcast({
      type: 'occupancy_update',
      room_id: roomId,
      count: data.count || 0,
      confidence: data.confidence || 0,
      activity: data.activity || 'idle',
      presence: data.presence || false,
      motion: data.motion || false,
      score: data.score || 0,
      node_id: nodeId,
      lastMotion: new Date().toISOString(),
      timestamp: new Date().toISOString()
    });

    // Also update the REST API occupancy store via internal HTTP-like call
    // This ensures GET /api/v1/zones returns fresh data
    if (this._updateOccupancyFn) {
      this._updateOccupancyFn(roomId, {
        count: data.count || 0,
        confidence: data.confidence || 0,
        activity: data.activity || 'idle',
        lastMotion: new Date().toISOString()
      });
    }
  }

  handleStatus(nodeId, data) {
    // Track ESP32 node status
    this.espNodes[nodeId] = {
      ...data,
      lastSeen: new Date().toISOString()
    };

    // Broadcast ESP32 connectivity to dashboard
    this.wsService.broadcast({
      type: 'esp32_status',
      node_id: nodeId,
      connected: true,
      ip: data.ip,
      rssi: data.rssi,
      free_heap: data.free_heap,
      uptime_s: data.uptime_s,
      calibrated: data.calibrated,
      timestamp: new Date().toISOString()
    });
  }

  handleHealth(personId, data) {
    this.wsService.broadcast({
      type: 'health_update',
      person_id: personId,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  handleAlert(alertType, data) {
    this.wsService.broadcast({
      type: 'new_alert',
      alert: {
        type: alertType || data.type || 'info',
        severity: data.severity || 'warning',
        message: data.message || '',
        room_id: data.room_id || null,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Allow zones route to register its occupancy update function
  setOccupancyUpdater(fn) {
    this._updateOccupancyFn = fn;
  }

  isConnected() {
    return this.connected;
  }

  getNodeStatus() {
    return this.espNodes;
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.connected = false;
    }
  }
}

module.exports = { MQTTBridge };
