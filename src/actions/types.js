// common actions
export const PLAYERS_REQUESTED = "PLAYERS_REQUESTED"; // createPlayerActions, twoOnTwoActions
export const PLAYERS_RETURNED = "PLAYERS_RETURNED"; // createPlayerActions, twoOnTwoActions
export const GET_SPORTS = "GET_SPORTS"; // latestGamesActions, gameListActions
export const GAME_CREATED = "GAME_CREATED"; // scoreKeeperActions, twoOnTwoActions
export const SPORT_REQUESTED = "SPORT_REQUESTED"; // scoreKeeperActions, twoOnTwoActions
export const SPORT_RETURNED = "SPORT_RETURNED"; // scoreKeeperActions, twoOnTwoActions
export const DATA_LOADING = "DATA_LOADING";
export const DATA_LOADED = "DATA_LOADED";
export const SET_SESSION = "SET_SESSION";
export const GET_SESSION = "GET_SESSION";
export const DELETE_SESSION = "DELETE_SESSION";

// scoreKeeperActions
export const GAME_REQUESTED = "GAME_REQUESTED";
export const GAME_RETURNED = "GAME_RETURNED";
export const GAME_FETCH_ERROR = "GAME_FETCH_ERROR";
export const UPDATE_GAME = "UPDATE_GAME";
export const POST_GAME_ACTION_STARTED = "POST_GAME_ACTION_STARTED";
export const POST_GAME_ACTION_COMPLETED = "POST_GAME_ACTION_COMPLETED";
export const UPDATE_PLAYER = "UPDATE_PLAYER";

// topPlayerActions
export const GET_TOP_PLAYERS = "GET_TOP_PLAYERS";
export const SELECT_SPORT = "SELECT_SPORT";

// latestGamesActions
export const GET_LATEST_GAMES = "GET_LATEST_GAMES";

// playerListActions
export const GET_PLAYERS_BY_PAGE = "GET_PLAYERS_BY_PAGE";
export const PLAYERS_HAS_MORE = "PLAYERS_HAS_MORE";

// gameListActions
export const GET_GAMES_BY_PAGE = "GET_GAMES_BY_PAGE";
export const GAMES_HAS_MORE = "GAMES_HAS_MORE";
export const GAMES_RESET = "GAMES_RESET";

// createPlayerActions
export const PLAYER_CREATED = "PLAYER_CREATED";
export const PLAYER_CREATION_REQUESTED = "PLAYER_CREATION_REQUESTED";

// twoOnTwoActions
export const GAME_CREATION_REQUESTED = "GAME_CREATION_REQUESTED";

// loginActions
export const GET_USER = "GET_USER";
