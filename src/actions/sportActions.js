import tracker from "../apis/tracker";
import { GET_SPORTS } from "./types";
import { getDigest } from "../helpers/hmac";

export const getSports = () => async dispatch => {
  const response = await tracker.get("/sports", {
    params: {
      enabled: true,
      token: getDigest(),
    },
  });
  dispatch({ type: GET_SPORTS, payload: response.data });
};
