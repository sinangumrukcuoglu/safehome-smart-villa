/**
 * SafeHome API Service
 * Backend API ile iletişim
 */

const API_URL = 'http://10.0.0.1:3000/api/v1'; // Gateway IP
const WS_URL = 'ws://10.0.0.1:3000/ws';

// Zones / Rooms
export const getZones = async () => {
  try {
    const response = await fetch(`${API_URL}/zones`);
    return await response.json();
  } catch (error) {
    console.error('getZones error:', error);
    return null;
  }
};

export const getZoneOccupancy = async (zoneId) => {
  try {
    const response = await fetch(`${API_URL}/zones/${zoneId}/occupancy`);
    return await response.json();
  } catch (error) {
    console.error('getZoneOccupancy error:', error);
    return null;
  }
};

// Persons
export const getPersons = async () => {
  try {
    const response = await fetch(`${API_URL}/persons`);
    return await response.json();
  } catch (error) {
    console.error('getPersons error:', error);
    return null;
  }
};

export const getPersonHealth = async (personId) => {
  try {
    const response = await fetch(`${API_URL}/persons/${personId}/health`);
    return await response.json();
  } catch (error) {
    console.error('getPersonHealth error:', error);
    return null;
  }
};

// Health
export const getVitals = async () => {
  try {
    const response = await fetch(`${API_URL}/health/vitals`);
    return await response.json();
  } catch (error) {
    console.error('getVitals error:', error);
    return null;
  }
};

// Alerts
export const getAlerts = async () => {
  try {
    const response = await fetch(`${API_URL}/alerts`);
    return await response.json();
  } catch (error) {
    console.error('getAlerts error:', error);
    return null;
  }
};

export const acknowledgeAlert = async (alertId) => {
  try {
    const response = await fetch(`${API_URL}/alerts/${alertId}/acknowledge`, {
      method: 'POST'
    });
    return await response.json();
  } catch (error) {
    console.error('acknowledgeAlert error:', error);
    return null;
  }
};

// Automation
export const getAutomationRules = async () => {
  try {
    const response = await fetch(`${API_URL}/automation/rules`);
    return await response.json();
  } catch (error) {
    console.error('getAutomationRules error:', error);
    return null;
  }
};

export const toggleRule = async (ruleId) => {
  try {
    const response = await fetch(`${API_URL}/automation/rules/${ruleId}/toggle`, {
      method: 'POST'
    });
    return await response.json();
  } catch (error) {
    console.error('toggleRule error:', error);
    return null;
  }
};

// Stats
export const getStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    return await response.json();
  } catch (error) {
    console.error('getStats error:', error);
    return null;
  }
};

// WebSocket Service
class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.notifyListeners(data);
          } catch (e) {
            console.error('WS message parse error:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.ws = null;
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  unsubscribe(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(data) {
    const eventType = data.type;
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => callback(data));
    }
    // Notify all subscribers
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => callback(data));
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export const wsService = new WebSocketService();

// Auto-refresh configuration
export const CONFIG = {
  REFRESH_INTERVAL: 5000, // 5 seconds
  WS_RECONNECT_DELAY: 3000, // 3 seconds
};
