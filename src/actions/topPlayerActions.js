import { GET_TOP_PLAYERS } from "./types";
import tracker from "../apis/tracker";

export const getTopPlayerData = () => dispatch => {
  getTopPlayers(dispatch);
};

const getTopPlayers = async dispatch => {
  const response = await tracker.get(`/players`, {
    params: {
      sort: ["elo", "name"],
      order: ["desc", "asc"],
      limit: 10,
      where: {
        sportid: 1,
      },
    },
  });
  dispatch({ type: GET_TOP_PLAYERS, payload: response.data });
};
