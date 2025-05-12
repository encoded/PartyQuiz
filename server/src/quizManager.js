const { CLIENT_TO_SERVER, SERVER_TO_CLIENT } = require('@shared/messages');
const { getClientSanitisedIp } = require('@src/utils');

class QuizManager {
  constructor(wss, questions = [], players = [], timePerQuestion = 10) {
    this.wss = wss;
    this.players = players;
    this.questions = questions;
    this.timePerQuestion = timePerQuestion;
    this.currentQuestionIndex = -1;
    this.timer = null;
    this.answers = new Map(); // ws => answer
    this.scores = new Map();  // ws => score
    this.isQuestionActive = false;
    this.hasStarted = false;
  }

  start() {
    if (this.hasStarted) {
      console.log("The quiz has already started. Cannot start again.");
      return;
    }

    if (this.questions.length === 0) {
      console.log("Cannot start quiz with no quiz data.");
      return;
    }

    this.scores.clear();
    for (const ws of this.players.keys()) {
      this.scores.set(ws, 0);
    }

    this.hasStarted = true;
    this.currentQuestionIndex = -1;
    this.nextQuestion();
  }

  setQuizQuestions(questions) {
    if (this.hasStarted) {
      console.log("Cannot set quiz data after the quiz has started.");
      return;
    }

    this.questions = questions;
    console.log("Quiz data updated!");
  }

  restart() {
    this.reset();
    this.start();
  }

  reset() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.hasStarted = false;
    this.currentQuestionIndex = -1;
    this.isQuestionActive = false;
  }

  nextQuestion() {
    if (this.isQuestionActive) {
      console.log("Cannot start a new question while another one is active.");
      return;
    }

    this.answers.clear();
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      const finalScores = Array.from(this.scores.entries()).map(([ws, score]) => ({
        player: getClientSanitisedIp(ws),
        score
      }));

      this.broadcast({
        type: SERVER_TO_CLIENT.GAME_END,
        scores: finalScores,
      });

      this.reset();
      return;
    }

    const q = this.questions[this.currentQuestionIndex];
    const shuffledOptions = this.shuffleOptions([...q.incorrect_answers, q.correct_answer]);

    this.correctAnswer = q.correct_answer;
    this.correctIndex = shuffledOptions.findIndex(opt => opt === q.correct_answer);

    const questionData = {
      type: SERVER_TO_CLIENT.QUESTION_START,
      question: q.question,
      options: shuffledOptions,
      correctIndex: this.correctIndex,
      timeLimit: this.timePerQuestion,
    };

    this.isQuestionActive = true;
    this.broadcast(questionData);

    this.timer = setTimeout(() => {
      this.endQuestion();
    }, this.timePerQuestion * 1000);
  }

  receiveAnswer(ws, selectedIndex) {
    if (!this.answers.has(ws)) {
      this.answers.set(ws, selectedIndex);
    }
  }

  endQuestion() {
    const summary = [];

    for (const [ws, index] of this.answers.entries()) {
      const correct = index === this.correctIndex;
      if (correct) {
        this.scores.set(ws, (this.scores.get(ws) || 0) + 1);
      }

      summary.push({ player: getClientSanitisedIp(ws), index});
    }

    this.broadcast({
      type: SERVER_TO_CLIENT.QUESTION_END,
      correctIndex: this.correctIndex,
      summary,
    });

    this.isQuestionActive = false;

    this.timer = setTimeout(() => this.nextQuestion(), 2000);
  }

  broadcast(data) {
    console.log("Quiz Manager message broadcast: ", data);
    const message = JSON.stringify(data);
    this.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }

  shuffleOptions(options) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }
}

module.exports = QuizManager;
