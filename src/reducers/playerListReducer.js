import _ from "lodash-es";
import { GET_PLAYERS_BY_PAGE, PLAYERS_HAS_MORE } from "../actions/types";

const initialState = {
  players: [],
  hasMore: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAYERS_BY_PAGE:
      return { ...state, players: _.union(state.players, action.payload) };
    case PLAYERS_HAS_MORE:
      return { ...state, hasMore: action.payload };
    default:
      return state;
  }
};
