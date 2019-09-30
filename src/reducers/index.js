import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import sportsReducer from "./sportReducer";
import latestGamesReducer from "./latestGamesReducer";
import topPlayerReducer from "./topPlayerReducer";
import playerListReducer from "./playerListReducer";
import gameListReducer from "./gameListReducer";

export default combineReducers({
  form: formReducer,
  sports: sportsReducer,
  latestGames: latestGamesReducer,
  topPlayers: topPlayerReducer,
  playerList: playerListReducer,
  gameList: gameListReducer,
});
