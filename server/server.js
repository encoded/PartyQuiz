// @src/index.js
require('module-alias/register');
const QuizGameServer = require('@src/quizGameServer');

const PORT = 3000;
new QuizGameServer(PORT);
