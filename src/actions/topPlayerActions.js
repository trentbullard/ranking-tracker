import { GET_TOP_PLAYERS, SELECT_SPORT } from "./types";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";

export const getTopPlayerData = sportId => async dispatch => {
  getTopPlayers(sportId, dispatch);
};

const getTopPlayers = async (sportId, dispatch) => {
  const response = await tracker.get(`/players`, {
    params: {
      sort: ["elo", "name"],
      order: ["desc", "asc"],
      limit: 10,
      where: {
        sportId,
      },
      token: getDigest("get", "/players"),
    },
  });
  dispatch({ type: SELECT_SPORT, payload: sportId });
  dispatch({ type: GET_TOP_PLAYERS, payload: response.data });
};
