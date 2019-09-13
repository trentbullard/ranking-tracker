import _ from "lodash";
import { GET_USER, SET_SESSION, GET_SESSION, DELETE_SESSION } from "./types";
import { encryptData } from "../helpers/aes";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import Cookies from "js-cookie";

export const checkSession = () => async dispatch => {
  dispatch({ type: GET_SESSION });
  const sessionId = Cookies.get("session-id");
  const sessionResponse = await tracker.get("/session", {
    params: {
      sessionId,
      token: getDigest("get", "/session"),
    },
  });
  dispatch({ type: GET_USER, payload: sessionResponse.data });
};

export const getUser = (email, password) => async (dispatch, getState) => {
  const cipher = encryptData({ email, password });
  const authResponse = await tracker.get("/auth", {
    params: {
      cipher,
      token: getDigest("get", "/auth"),
    },
  });
  dispatch({ type: GET_USER, payload: authResponse.data });
  const user = authResponse.data[0];
  if (_.isEmpty(user)) {
    return null;
  }
  const userId = user.id;
  const sessionResponse = await tracker.post(
    "/login",
    {
      userId,
    },
    {
      params: {
        token: getDigest("post", "/login"),
      },
    },
  );
  const sessionId = sessionResponse.data.sessionId;
  dispatch({ type: SET_SESSION, payload: sessionId });
};

export const logout = () => dispatch => {
  dispatch({ type: DELETE_SESSION });
};
