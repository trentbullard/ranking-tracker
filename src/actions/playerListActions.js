import {
  GET_PLAYERS_BY_PAGE,
  PLAYERS_HAS_MORE,
  GET_SPORTS,
  SELECT_SPORT,
} from "./types";
import { getDigest } from "../helpers/hmac";
import tracker from "../apis/tracker";

export const getSports = () => async dispatch => {
  const response = await tracker.get(`/sports`, {
    params: {
      where: {
        enabled: true,
      },
      token: getDigest(),
    },
  });
  dispatch({ type: GET_SPORTS, payload: response.data });
};

export const getPlayersByPage = (page, limit) => (dispatch, getState) => {
  let selectedSportId = getState().playerList.selectedSportId;
  getPlayers(selectedSportId, page, limit, dispatch).then(hasMore => {
    dispatch({ type: PLAYERS_HAS_MORE, payload: !!hasMore });
  });
};

export const selectSport = sportId => async dispatch => {
  dispatch({ type: SELECT_SPORT, payload: sportId });
};

const getPlayers = async (sportId, page, limit = 10, dispatch) => {
  const response = await tracker.get(`/players`, {
    params: {
      sort: ["elo", "name"],
      order: ["desc", "asc"],
      page,
      limit,
      sportId,
      token: getDigest(),
    },
  });
  dispatch({ type: GET_PLAYERS_BY_PAGE, payload: response.data });
  return response.data.length == limit;
};
