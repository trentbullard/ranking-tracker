import _ from "lodash-es";
import {
  GAME_REQUESTED,
  GAME_RETURNED,
  SPORT_REQUESTED,
  SPORT_RETURNED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  GAME_CREATED,
  UPDATE_PLAYER,
  UPDATE_GAME,
  DATA_LOADING,
  DATA_LOADED,
} from "../actions/types";
import { getGamesFromRecords } from "../helpers/games";

const initialState = {
  gameRequested: false,
  sportRequested: false,
  playersRequested: false,
  game: {},
  sport: {},
  players: {},
  loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DATA_LOADING:
      return { ...state, loading: true };
    case DATA_LOADED:
      return { ...state, loading: false };
    case GAME_REQUESTED:
      return { ...state, gameRequested: true };
    case GAME_RETURNED:
      return {
        ...state,
        game: _.first(getGamesFromRecords(action.payload)),
      };
    case GAME_CREATED:
      return { ...state, game: { [action.payload.id]: { ...action.payload } } };
    case SPORT_REQUESTED:
      return { ...state, sportRequested: true };
    case SPORT_RETURNED:
      return {
        ...state,
        sport: _.first(action.payload),
      };
    case PLAYERS_REQUESTED:
      return { ...state, playersRequested: true };
    case PLAYERS_RETURNED:
      return {
        ...state,
        players: _.mapKeys(action.payload, "id"),
      };
    case UPDATE_PLAYER:
      return {
        ...state,
        players: { ...state.players, [action.payload.id]: action.payload },
      };
    case UPDATE_GAME:
      return {
        ...state,
        game: { [action.payload.id]: { ...action.payload } },
      };
    default:
      return state;
  }
};
