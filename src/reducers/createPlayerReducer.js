import _ from "lodash-es";
import {
  PLAYER_CREATED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  PLAYER_CREATION_REQUESTED,
} from "../actions/types";

const initialState = {
  playersRequested: false,
  playerNames: [],
  createPlayerRequested: false,
  createdPlayerReturned: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PLAYER_CREATION_REQUESTED:
      return { ...state, createPlayerRequested: true };
    case PLAYER_CREATED:
      return { ...state, createdPlayerReturned: action.payload };
    case PLAYERS_REQUESTED:
      return { ...state, playersRequested: true };
    case PLAYERS_RETURNED:
      return {
        ...state,
        playerNames: _.map(action.payload, "name"),
      };
    default:
      return state;
  }
};
