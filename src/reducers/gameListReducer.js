import _ from "lodash-es";
import {
  GET_GAMES_BY_PAGE,
  GAMES_HAS_MORE,
  GAMES_RESET,
} from "../actions/types";

const initialState = {
  games: [],
  hasMore: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAMES_RESET:
      return initialState;
    case GET_GAMES_BY_PAGE:
      return { ...state, games: _.union(state.games, action.payload) };
    case GAMES_HAS_MORE:
      return { ...state, hasMore: action.payload };
    default:
      return state;
  }
};
