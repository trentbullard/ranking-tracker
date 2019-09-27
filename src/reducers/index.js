import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import sportsReducer from "./sportReducer";
import scoreKeeperReducer from "./scoreKeeperReducer";
import latestGamesReducer from "./latestGamesReducer";
import topPlayerReducer from "./topPlayerReducer";
import playerListReducer from "./playerListReducer";
import gameListReducer from "./gameListReducer";
import twoOnTwoReducer from "./twoOnTwoReducer";
import createPlayerReducer from "./createPlayerReducer";
import registrationReducer from "./registrationReducer";

export default combineReducers({
  form: formReducer,
  sports: sportsReducer,
  scoreKeeper: scoreKeeperReducer,
  latestGames: latestGamesReducer,
  topPlayers: topPlayerReducer,
  playerList: playerListReducer,
  gameList: gameListReducer,
  twoOnTwo: twoOnTwoReducer,
  createPlayer: createPlayerReducer,
  registration: registrationReducer,
});
