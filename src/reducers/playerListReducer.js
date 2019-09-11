import _ from "lodash-es";
import {
  GET_PLAYERS_BY_PAGE,
  PLAYERS_HAS_MORE,
  GET_SPORTS,
  SELECT_SPORT,
} from "../actions/types";

const initialState = {
  selectedSportId: 1,
  players: [],
  hasMore: true,
  sports: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_SPORT:
      return {
        ...state,
        selectedSportId: action.payload,
        players: [],
        hasMore: true,
      };
    case GET_SPORTS:
      return {
        ...state,
        sports: _.mapKeys(action.payload, "id"),
      };
    case GET_PLAYERS_BY_PAGE:
      return {
        ...state,
        players: _.unionBy(state.players, action.payload, "id"),
      };
    case PLAYERS_HAS_MORE:
      return { ...state, hasMore: action.payload };
    default:
      return state;
  }
};
