import { GET_TOP_PLAYERS } from "./types";
import tracker from "../apis/tracker";

export const getTopPlayerData = () => dispatch => {
  getTopPlayers(dispatch);
};

const getTopPlayers = async dispatch => {
  const response = await tracker.get(`/players`, {
    params: {
      _sort: "elo,name",
      _order: "desc,asc",
      _limit: 10,
    },
  });
  dispatch({ type: GET_TOP_PLAYERS, payload: response.data });
  return response.data;
};
