/**
 * WebSocket Service
 * Real-time veri akışı
 */

class WebSocketService {
  constructor(wss) {
    this.wss = wss;
    this.clients = new Set();
    
    wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });
  }
  
  handleConnection(ws, req) {
    console.log('WebSocket client connected');
    this.clients.add(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date().toISOString(),
      message: 'SafeHome WebSocket Connected'
    }));
    
    ws.on('message', (message) => {
      this.handleMessage(ws, message);
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      this.clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.clients.delete(ws);
    });
  }
  
  handleMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data.type);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          break;
        case 'subscribe':
          // Handle room/person subscriptions
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  }
  
  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }
  
  sendTo(client, data) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  }
  
  getClientCount() {
    return this.clients.size;
  }
}

module.exports = { WebSocketService };
