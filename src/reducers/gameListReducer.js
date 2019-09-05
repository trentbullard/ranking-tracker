import _ from "lodash-es";
import {
  GET_GAMES_BY_PAGE,
  GAMES_HAS_MORE,
  GAMES_RESET,
  DATA_LOADING,
  DATA_LOADED,
  GET_SPORTS,
} from "../actions/types";
import { getGamesFromRecords } from "../helpers/games";

const initialState = {
  games: [],
  sports: [],
  hasMore: true,
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DATA_LOADING:
      return { ...state, loading: true };
    case DATA_LOADED:
      return { ...state, loading: false };
    case GAMES_RESET:
      return initialState;
    case GET_GAMES_BY_PAGE:
      let games = _.unionBy(
        state.games,
        getGamesFromRecords(action.payload),
        "id",
      );
      return { ...state, games };
    case GET_SPORTS:
      return { ...state, sports: _.mapKeys(action.payload, "id") };
    case GAMES_HAS_MORE:
      return { ...state, hasMore: action.payload };
    default:
      return state;
  }
};
