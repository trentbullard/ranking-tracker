import { GET_TOP_PLAYERS } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case GET_TOP_PLAYERS:
      return action.payload;
    default:
      return state;
  }
};
