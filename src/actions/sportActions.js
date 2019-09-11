import tracker from "../apis/tracker";
import { GET_SPORTS } from "./types";

export const getSports = () => async dispatch => {
  const response = await tracker.get("/sports", {
    params: {
      enabled: true,
    },
  });
  dispatch({ type: GET_SPORTS, payload: response.data });
};
