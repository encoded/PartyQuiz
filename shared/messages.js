// For simplicity these messages are defined with an action
export const CLIENT_TO_SERVER = {
  INIT_SERVER: 'init_server',
  JOIN: 'join',
  GET_PLAYERS: 'get_players',
  START_GAME: 'start_game',
  SUBMIT_ANSWER: 'answer_submit',
  PING: 'ping',
};

// For simplicity these messages are defined as noun of actions that have been perfomed
export const SERVER_TO_CLIENT = {
  GAME_START: 'game_start',
  GAME_END: 'game_end',
  PLAYER_LIST: 'player_list',
  QUESTION_START: 'question_start',
  QUESTION_END: 'question_end',
  PONG: 'pong',
};
