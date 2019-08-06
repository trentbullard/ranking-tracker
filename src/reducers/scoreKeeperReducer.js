import _ from "lodash-es";
import {
  GAME_REQUESTED,
  GAME_RETURNED,
  SPORT_REQUESTED,
  SPORT_RETURNED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  GAME_CREATED,
} from "../actions/types";

const initialState = {
  gameRequested: false,
  sportRequested: false,
  playersRequested: false,
  game: {},
  sport: {},
  players: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_REQUESTED:
      return { ...state, gameRequested: true };
    case GAME_RETURNED:
      return {
        ...state,
        game: _.mapKeys(action.payload, "id"),
      };
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
