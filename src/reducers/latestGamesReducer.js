import { GET_LATEST_GAMES } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case GET_LATEST_GAMES:
      return action.payload;
    default:
      return state;
  }
};
