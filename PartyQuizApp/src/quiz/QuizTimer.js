export const QuizTimerState = {
  IDLE: 0,
  STARTED: 1,
  PAUSED: 2,
  COMPLETED: 3,
  STOPPED: 4,
};

export default class QuizTimer {
  constructor({
    durationSeconds = 0,
    onTick = () => {},
    onQuizTimerStateChanged = () => {},
  }) {
    this.durationSeconds = durationSeconds;
    this.remainingSeconds = this.durationSeconds;

    this.onTick = onTick;

    this.status = QuizTimerState.IDLE;
    this.onQuizTimerStateChanged = onQuizTimerStateChanged;

    this._interval = null;
  }

  _setStatus(status) {
    this.status = status;
    this.onQuizTimerStateChanged(status);
  }  

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  isQuizTimerRunning() {
    return this.status === QuizTimerState.STARTED;
  }  

  setDuration(durationSeconds) {
    if (typeof durationSeconds !== 'number' || durationSeconds <= 0) return;

    if (this.isQuizTimerRunning()) {
      console.warn("Cannot set duration while QuizTimer is running.");
      return;
    }
  
    this.durationSeconds = durationSeconds;
    this.remainingSeconds = durationSeconds;
    this.onTick(this.remainingSeconds);
  }

  async start(durationSeconds) {
    this.setDuration(durationSeconds);

    this._clearInterval();

    this._startInternal();
  }

  resume() {
    if (this.isQuizTimerRunning() || this.remainingSeconds <= 0) return;
  
    this._clearInterval();
  
    this._startInternal();
  }  

  _startInternal() {
    this._setStatus(QuizTimerState.STARTED);
  
    this._interval = setInterval(() => {
      this.remainingSeconds = Math.max(this.remainingSeconds - 1, 0);
      this.onTick(this.remainingSeconds);
  
      if (this.remainingSeconds === 0) {
        this._clearInterval();
        this._setStatus(QuizTimerState.COMPLETED);
      }
    }, 1000);
  }

  pause() {
    if (!this.isQuizTimerRunning()) return;
    this._clearInterval();
    this._setStatus(QuizTimerState.PAUSED);
    // Keep remainingSeconds as is
  }

  async stop() {
    this._clearInterval();
    this.onTick(this.remainingSeconds);
    this._setStatus(QuizTimerState.STOPPED);
    this.remainingSeconds = this.durationSeconds;
  }
}
