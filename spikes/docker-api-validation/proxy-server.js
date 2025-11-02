#!/usr/bin/env node

/**
 * WebSocket Proxy Server for Docker Events
 * Demonstrates how to safely expose Docker events to a browser
 * Part of spike for ILI-93
 */

import { createServer } from 'http';
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const PORT = 3001;

// Simple HTTP server that serves both the HTML page and WebSocket endpoint
const server = createServer(async (req, res) => {
  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the demo page
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Docker Events Monitor - ILI-93 Spike</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0e27;
      color: #e0e0e0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #00d4ff;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #888;
      margin-bottom: 30px;
    }
    .controls {
      background: #1a1f3a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    button {
      background: #00d4ff;
      color: #0a0e27;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-right: 10px;
    }
    button:hover {
      background: #00b8e6;
    }
    button:disabled {
      background: #555;
      cursor: not-allowed;
    }
    .status {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      margin-left: 10px;
    }
    .status.connected {
      background: #00ff88;
      color: #0a0e27;
    }
    .status.disconnected {
      background: #ff4444;
      color: white;
    }
    .events {
      background: #1a1f3a;
      border-radius: 8px;
      padding: 20px;
      height: 600px;
      overflow-y: auto;
    }
    .event {
      background: #252b4a;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
      border-left: 4px solid #00d4ff;
    }
    .event-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .event-type {
      font-weight: bold;
      color: #00d4ff;
    }
    .event-time {
      color: #888;
      font-size: 0.9em;
    }
    .event-details {
      font-size: 0.9em;
      color: #ccc;
    }
    .stats {
      background: #1a1f3a;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .stat-item {
      background: #252b4a;
      padding: 15px;
      border-radius: 4px;
    }
    .stat-label {
      color: #888;
      font-size: 0.9em;
    }
    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #00d4ff;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🐳 Docker Events Monitor</h1>
    <p class="subtitle">Real-time container lifecycle events (ILI-93 Spike)</p>

    <div class="controls">
      <button id="connectBtn" onclick="connect()">Connect</button>
      <button id="disconnectBtn" onclick="disconnect()" disabled>Disconnect</button>
      <button onclick="clearEvents()">Clear Events</button>
      <span class="status disconnected" id="status">Disconnected</span>
    </div>

    <div class="events" id="events">
      <div class="empty-state">
        Click "Connect" to start monitoring Docker events.<br>
        Then run some Docker commands to see events appear here!
      </div>
    </div>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-label">Total Events</div>
        <div class="stat-value" id="totalEvents">0</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Container Events</div>
        <div class="stat-value" id="containerEvents">0</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Image Events</div>
        <div class="stat-value" id="imageEvents">0</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Latency</div>
        <div class="stat-value" id="latency">-</div>
      </div>
    </div>
  </div>

  <script>
    let eventSource = null;
    let stats = { total: 0, container: 0, image: 0, network: 0, volume: 0 };

    function connect() {
      if (eventSource) return;

      document.getElementById('connectBtn').disabled = true;
      document.getElementById('disconnectBtn').disabled = false;
      document.getElementById('status').textContent = 'Connecting...';
      document.getElementById('status').className = 'status';

      eventSource = new EventSource('/events');

      eventSource.onopen = () => {
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('status').className = 'status connected';
        addSystemMessage('Connected to Docker event stream');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleEvent(data);
        } catch (error) {
          console.error('Error parsing event:', error);
        }
      };

      eventSource.onerror = () => {
        document.getElementById('status').textContent = 'Error';
        document.getElementById('status').className = 'status disconnected';
        addSystemMessage('Connection error - retrying...');
      };
    }

    function disconnect() {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      document.getElementById('connectBtn').disabled = false;
      document.getElementById('disconnectBtn').disabled = true;
      document.getElementById('status').textContent = 'Disconnected';
      document.getElementById('status').className = 'status disconnected';
      addSystemMessage('Disconnected from Docker event stream');
    }

    function handleEvent(event) {
      const container = document.getElementById('events');
      const emptyState = container.querySelector('.empty-state');
      if (emptyState) emptyState.remove();

      // Calculate latency
      const now = Date.now();
      const eventTime = event.time * 1000;
      const latency = now - eventTime;
      document.getElementById('latency').textContent = latency + 'ms';

      // Update stats
      stats.total++;
      if (event.Type) stats[event.Type] = (stats[event.Type] || 0) + 1;
      document.getElementById('totalEvents').textContent = stats.total;
      document.getElementById('containerEvents').textContent = stats.container || 0;
      document.getElementById('imageEvents').textContent = stats.image || 0;

      // Create event element
      const eventEl = document.createElement('div');
      eventEl.className = 'event';

      const emoji = getEmoji(event.Type, event.Action);
      const time = new Date(event.time * 1000).toLocaleTimeString();

      let details = '';
      if (event.Actor?.Attributes?.name) {
        details += \`Name: \${event.Actor.Attributes.name}<br>\`;
      }
      if (event.Actor?.Attributes?.image) {
        details += \`Image: \${event.Actor.Attributes.image}<br>\`;
      }
      if (event.id) {
        details += \`ID: \${event.id.substring(0, 12)}\`;
      }

      eventEl.innerHTML = \`
        <div class="event-header">
          <span class="event-type">\${emoji} \${event.Type?.toUpperCase() || 'UNKNOWN'}: \${event.Action}</span>
          <span class="event-time">\${time}</span>
        </div>
        <div class="event-details">\${details}</div>
      \`;

      container.insertBefore(eventEl, container.firstChild);

      // Keep only last 50 events
      while (container.children.length > 50) {
        container.removeChild(container.lastChild);
      }
    }

    function addSystemMessage(message) {
      const container = document.getElementById('events');
      const emptyState = container.querySelector('.empty-state');
      if (emptyState) emptyState.remove();

      const eventEl = document.createElement('div');
      eventEl.className = 'event';
      eventEl.style.borderLeftColor = '#888';
      eventEl.innerHTML = \`
        <div class="event-header">
          <span class="event-type">ℹ️  SYSTEM</span>
          <span class="event-time">\${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="event-details">\${message}</div>
      \`;
      container.insertBefore(eventEl, container.firstChild);
    }

    function getEmoji(type, action) {
      const map = {
        container: { create: '🏗️', start: '▶️', stop: '⏹️', die: '💀', kill: '🔪', destroy: '💥' },
        image: { pull: '⬇️', push: '⬆️', delete: '🗑️', tag: '🏷️' },
        network: { create: '🌐', connect: '🔌', disconnect: '🔌', destroy: '💥' },
        volume: { create: '💾', mount: '📁', unmount: '📁', destroy: '🗑️' }
      };
      return map[type]?.[action] || '📌';
    }

    function clearEvents() {
      const container = document.getElementById('events');
      container.innerHTML = '<div class="empty-state">Events cleared. Waiting for new events...</div>';
      stats = { total: 0, container: 0, image: 0, network: 0, volume: 0 };
      document.getElementById('totalEvents').textContent = '0';
      document.getElementById('containerEvents').textContent = '0';
      document.getElementById('imageEvents').textContent = '0';
      document.getElementById('latency').textContent = '-';
    }
  </script>
</body>
</html>
    `);
    return;
  }

  // Server-Sent Events endpoint for Docker events
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    try {
      const stream = await docker.getEvents({
        filters: {
          type: ['container', 'image', 'network', 'volume']
        }
      });

      stream.on('data', (chunk) => {
        try {
          const event = JSON.parse(chunk.toString());
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (error) {
          console.error('Error parsing event:', error);
        }
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        res.end();
      });

      req.on('close', () => {
        stream.destroy();
      });

    } catch (error) {
      console.error('Failed to create event stream:', error);
      res.end();
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   Docker Events Proxy Server (ILI-93 Spike)     ║
╚═══════════════════════════════════════════════════╝

🌐 Server running at: http://localhost:${PORT}

📝 This demonstrates:
   ✓ Backend proxy for Docker Engine API
   ✓ Server-Sent Events (SSE) for real-time updates
   ✓ Browser-safe Docker event monitoring
   ✓ Low-latency event streaming

🚀 Open http://localhost:${PORT} in your browser
   Then run Docker commands to see real-time events!

⚠️  Security Note:
   This proxy provides safe access to Docker events without
   exposing the Docker socket directly to the browser.
`);
});
