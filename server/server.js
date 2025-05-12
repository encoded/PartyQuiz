require('module-alias/register');
const { CLIENT_TO_SERVER, SERVER_TO_CLIENT } = require('@shared/messages');
const QuizManager = require('@src/quizManager');
const quizData = require('@data/tempQuizData');
const { getClientSanitisedIp } = require('@src/utils');

const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const os = require('os');
const app = express();

const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let quizManager = new QuizManager(wss, quizData);

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

    switch (data.type) {
      case CLIENT_TO_SERVER.INIT_SERVER: 
        quizManager.reset(); //reset quiz data
        players.clear(); // Clear all players
        broadcastPlayerList(); // Notify clients that the list is empty
        break;
      case CLIENT_TO_SERVER.JOIN: 
        const clientIp = getClientSanitisedIp(ws);
        console.log("Client IP:", clientIp);

        players.set(ws, { name: data.name, ip: clientIp });
        broadcastPlayerList();
        break;
      case CLIENT_TO_SERVER.GET_PLAYERS: 
        broadcastPlayerList();
        break;
      case CLIENT_TO_SERVER.START_GAME:
        broadcastMessage({ type: SERVER_TO_CLIENT.GAME_START });

        setTimeout(() => {
          quizManager = new QuizManager(wss, quizData, players);
          quizManager.restart();
        }, 1000);
        break;
      case CLIENT_TO_SERVER.SUBMIT_ANSWER:
        quizManager.receiveAnswer(ws, data.selectedIndex);
        break;
      case CLIENT_TO_SERVER.PING:
        broadcastMessage({ type: SERVER_TO_CLIENT.PONG });
        break;
      default:
        console.log('Unknown message type:', data.type);
    }

  });

  ws.on('close', () => {
    players.delete(ws);
    broadcastPlayerList();
  });
});

// Broadcast a message to all cients
function broadcastMessage(messageObj) {
  const message = JSON.stringify(messageObj);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


// Broadcast the updated list of players to all clients
function broadcastPlayerList() {
  const playerList = Array.from(players.values());
  broadcastMessage({ type: SERVER_TO_CLIENT.PLAYER_LIST, players: playerList });
}

app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Server running at http://${localIp}:${PORT}`);
});
