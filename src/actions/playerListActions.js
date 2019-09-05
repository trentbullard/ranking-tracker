import { GET_PLAYERS_BY_PAGE, PLAYERS_HAS_MORE } from "./types";
import tracker from "../apis/tracker";

export const getPlayersByPage = (page, limit) => dispatch => {
  getPlayers(page, limit, dispatch).then(hasMore => {
    dispatch({ type: PLAYERS_HAS_MORE, payload: !!hasMore });
  });
};

const getPlayers = async (page, limit = 10, dispatch) => {
  const response = await tracker.get(`/players`, {
    params: {
      sort: ["elo", "name"],
      order: ["desc", "asc"],
      page,
      limit,
      where: { sportId: 1 }, // TODO: Implement dynamic sport selection
    },
  });
  dispatch({ type: GET_PLAYERS_BY_PAGE, payload: response.data });
  return response.data.length;
};
