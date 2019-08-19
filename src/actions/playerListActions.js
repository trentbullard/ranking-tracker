import _ from "lodash-es";
import { GET_PLAYERS_BY_PAGE, PLAYERS_HAS_MORE } from "./types";
import tracker from "../apis/tracker";

export const getPlayersByPage = (page, limit) => dispatch => {
  getPlayers(page, limit, dispatch).then(link => {
    if (link) {
      let nextUrl = _.filter(
        _.map(link.split(","), pageRef => {
          let subs = pageRef.split(";");
          let rel = subs[1].replace(/"/g, "").split("rel=")[1];
          let url = subs[0].replace(/<|>/g, "").trim();
          return {
            [rel]: url,
          };
        }),
        pageObject => {
          return pageObject.next;
        },
      );
      if (nextUrl.length) {
        dispatch({ type: PLAYERS_HAS_MORE, payload: true });
      }
    } else {
      dispatch({ type: PLAYERS_HAS_MORE, payload: false });
    }
  });
};

const getPlayers = async (_page, _limit, dispatch) => {
  const response = await tracker.get(`/players`, {
    params: {
      _sort: "elo",
      _order: "desc",
      _page,
      _limit,
    },
  });
  dispatch({ type: GET_PLAYERS_BY_PAGE, payload: response.data });
  return response.headers.link;
};
