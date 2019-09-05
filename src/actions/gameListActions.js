import {
  GET_GAMES_BY_PAGE,
  GAMES_HAS_MORE,
  GET_SPORTS,
  GAMES_RESET,
  DATA_LOADING,
  DATA_LOADED,
} from "./types";
import tracker from "../apis/tracker";

export const getGameListData = () => dispatch => {
  dispatch({ type: GAMES_RESET });
  dispatch({ type: DATA_LOADING });
  getSports(dispatch);
  dispatch({ type: DATA_LOADED });
};

export const getGamesByPage = (page, limit) => async dispatch => {
  dispatch({ type: DATA_LOADING });
  let hasMore = await getGames(page, limit, dispatch)
  dispatch({ type: GAMES_HAS_MORE, payload: !!hasMore });
  dispatch({ type: DATA_LOADED });
};

const getSports = async dispatch => {
  const response = await tracker.get(`/sports`);
  dispatch({ type: GET_SPORTS, payload: response.data });
};

const getGames = async (page, limit, dispatch) => {
  const response = await tracker.get(`/games`, {
    params: {
      sort: ["started"],
      order: ["desc"],
      page,
      limit,
    },
  });
  dispatch({ type: GET_GAMES_BY_PAGE, payload: response.data });
  return response.data.length;
};
