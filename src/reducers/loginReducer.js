import _ from "lodash-es";
import {
  GET_USER,
  SET_SESSION,
  GET_SESSION,
  DELETE_SESSION,
} from "../actions/types";
import Cookies from "js-cookie";

const initialState = {
  currentUser: {},
  sessionId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      Cookies.set("session-id", action.payload);
      return {
        ...state,
        sessionId: action.payload,
      };
    case GET_SESSION:
      const sessionId = Cookies.get("session-id");
      return {
        ...state,
        sessionId,
      };
    case DELETE_SESSION:
      Cookies.remove("session-id");
      return initialState;
    case GET_USER:
      if (_.isEmpty(action.payload)) {
        return { ...state };
      }
      const currentUser = action.payload[0];
      return {
        ...state,
        currentUser: {
          ...currentUser,
          isAdmin: currentUser.isadmin,
          passwordHash: currentUser.passwordhash,
          createdAt: currentUser.createdat,
          sessionId: currentUser.sessionid,
        },
      };
    default:
      return { ...state };
  }
};
