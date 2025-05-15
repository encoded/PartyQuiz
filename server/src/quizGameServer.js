// @src/quizGameServer.js
const GameServer = require('./gameServer');
const QuizManager = require('./quizManager');
const { CLIENT_TO_SERVER, SERVER_TO_CLIENT } = require('@shared/messages');
const quizData = require('@data/tempQuizData');
const { getClientSanitisedIp } = require('@src/utils');

class QuizGameServer extends GameServer {
  constructor(port) {
    super(port);
    this.players = new Map();
    this.quizManager = new QuizManager(this.wss, quizData);
  }

  broadcastPlayerList() {
    const playerList = Array.from(this.players.values());
    this.broadcastMessage({
      type: SERVER_TO_CLIENT.PLAYER_LIST,
      players: playerList,
    });
  }

  onClientConnect(ws) {
    // No-op unless needed
  }

  onClientMessage(ws, data) {
    switch (data.type) {
      case CLIENT_TO_SERVER.INIT_SERVER:
        this.quizManager.reset();
        this.players.clear();
        this.broadcastPlayerList();
        break;

      case CLIENT_TO_SERVER.JOIN:
        const clientIp = getClientSanitisedIp(ws);
        this.players.set(ws, { name: data.name, ip: clientIp });
        this.broadcastPlayerList();
        break;

      case CLIENT_TO_SERVER.GET_PLAYERS:
        this.broadcastPlayerList();
        break;

      case CLIENT_TO_SERVER.START_GAME:
        this.broadcastMessage({ type: SERVER_TO_CLIENT.GAME_START });
        setTimeout(() => {
          this.quizManager = new QuizManager(this.wss, quizData, this.players);
          this.quizManager.restart();
        }, 1000);
        break;

      case CLIENT_TO_SERVER.SUBMIT_ANSWER:
        this.quizManager.receiveAnswer(ws, data.selectedIndex);
        break;

      case CLIENT_TO_SERVER.PING:
        this.broadcastMessage({ type: SERVER_TO_CLIENT.PONG });
        break;

      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  onClientDisconnect(ws) {
    this.players.delete(ws);
    this.broadcastPlayerList();
  }
}

module.exports = QuizGameServer;
