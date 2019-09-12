import {
  GET_LATEST_GAMES,
  GET_SPORTS,
  DATA_LOADING,
  DATA_LOADED,
} from "./types";
import { getDigest } from "../helpers/hmac";
import tracker from "../apis/tracker";

export const getLatestGameData = () => async dispatch => {
  dispatch({ type: DATA_LOADING });
  await getSports(dispatch);
  getLatestGames(dispatch);
  dispatch({ type: DATA_LOADED });
};

const getSports = async dispatch => {
  const response = await tracker.get(`/sports`, {
    params: { token: getDigest() },
  });
  dispatch({ type: GET_SPORTS, payload: response.data });
};

const getLatestGames = async dispatch => {
  const response = await tracker.get(`/games`, {
    params: {
      sort: ["started"],
      order: ["desc"],
      limit: 10,
      token: getDigest(),
    },
  });
  dispatch({ type: GET_LATEST_GAMES, payload: response.data });
};
