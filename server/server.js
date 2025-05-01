const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const os = require('os');
const app = express();

const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const players = new Map(); // Store players by their WebSocket connection

// Get local IP address
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let i = 0; i < interfaces[iface].length; i++) {
      const ifaceInfo = interfaces[iface][i];
      if (ifaceInfo.family === 'IPv4' && !ifaceInfo.internal) {
        return ifaceInfo.address;
      }
    }
  }
  return 'localhost';
};

const localIp = getLocalIPAddress();

wss.on('connection', (ws) => {
  console.log('Player connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Message:', data);

    if (data.type === 'join') {
      const rawIp = ws._socket.remoteAddress;
      const clientIp = rawIp.startsWith("::ffff:") ? rawIp.replace("::ffff:", "") : rawIp;
      console.log("Client IP:", clientIp);

      players.set(ws, { name: data.name, ip: clientIp });
      broadcastPlayerList();
    }
    else if (data.type === 'get_players') {
      broadcastPlayerList();
    }
  });

  ws.on('close', () => {
    players.delete(ws);
    broadcastPlayerList();
  });
});

// Broadcast the updated list of players to all clients
function broadcastPlayerList() {
  const playerList = Array.from(players.values());
  const message = JSON.stringify({ type: 'player_list', players: playerList });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Server running at http://${localIp}:${PORT}`);
});
