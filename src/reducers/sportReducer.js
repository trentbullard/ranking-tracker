import _ from "lodash-es";
import { GET_SPORTS } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_SPORTS:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    default:
      return state;
  }
};
