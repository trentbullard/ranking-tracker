import _ from "lodash-es";
import {
  SPORT_REQUESTED,
  SPORT_RETURNED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  GAME_CREATED,
  GAME_CREATION_REQUESTED,
} from "../actions/types";

const initialState = {
  sportRequested: false,
  playersRequested: false,
  gameCreationRequested: false,
  game: {},
  sport: {},
  players: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_CREATION_REQUESTED:
      return { ...state, gameCreationRequested: true };
    case GAME_CREATED:
      return { ...state, game: { [action.payload.id]: { ...action.payload } } };
    case SPORT_REQUESTED:
      return { ...state, sportRequested: true };
    case SPORT_RETURNED:
      return {
        ...state,
        sport: _.mapKeys(action.payload, "id"),
      };
    case PLAYERS_REQUESTED:
      return { ...state, playersRequested: true };
    case PLAYERS_RETURNED:
      return {
        ...state,
        players: action.payload,
      };
    default:
      return state;
  }
};
