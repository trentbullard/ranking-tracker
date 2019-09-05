import _ from "lodash-es";
import {
  GET_LATEST_GAMES,
  DATA_LOADING,
  DATA_LOADED,
  GET_SPORTS,
} from "../actions/types";
import { getGamesFromRecords } from "../helpers/games";

const initialState = {
  games: [],
  sports: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DATA_LOADING:
      return { ...state, loading: true };
    case DATA_LOADED:
      return { ...state, loading: false };
    case GET_SPORTS:
      return { ...state, sports: _.mapKeys(action.payload, "id") };
    case GET_LATEST_GAMES:
      return { ...state, games: getGamesFromRecords(action.payload) };
    default:
      return state;
  }
};
