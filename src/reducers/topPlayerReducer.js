import _ from "lodash-es";
import { GET_TOP_PLAYERS, SELECT_SPORT } from "../actions/types";
import { getPlayersFromRecords } from "../helpers/players";

const initialState = {
  sport: 1,
  players: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_SPORT:
      return { ...state, sport: action.payload };
    case GET_TOP_PLAYERS:
      let players = _.slice(
        _.orderBy(
          getPlayersFromRecords(action.payload)[state.sport],
          ["elo", "name"],
          ["desc", "asc"],
        ),
        0,
        10,
      );
      return { ...state, players };
    default:
      return state;
  }
};
