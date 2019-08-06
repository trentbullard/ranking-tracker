import { GET_LATEST_GAMES, GET_SPORTS } from "./types";
import tracker from "../apis/tracker";

export const getLatestGameData = () => dispatch => {
  getSports(dispatch).then(() => {
    getLatestGames(dispatch);
  });
};

const getSports = async dispatch => {
  const response = await tracker.get(`/sports`);
  dispatch({ type: GET_SPORTS, payload: response.data });
  return response.data;
};

const getLatestGames = async dispatch => {
  const response = await tracker.get(`/games`, {
    params: {
      _sort: "started",
      _order: "desc",
      _limit: 10,
    },
  });
  dispatch({ type: GET_LATEST_GAMES, payload: response.data });
  return response.data;
};
