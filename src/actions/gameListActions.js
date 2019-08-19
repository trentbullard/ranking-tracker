import _ from "lodash-es";
import {
  GET_GAMES_BY_PAGE,
  GAMES_HAS_MORE,
  GET_SPORTS,
  GAMES_RESET,
} from "./types";
import tracker from "../apis/tracker";

export const getGameListData = () => dispatch => {
  dispatch({ type: GAMES_RESET });
  getSports(dispatch);
};

export const getGamesByPage = (page, limit) => async (dispatch, getState) => {
  getGames(page, limit, dispatch).then(link => {
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
        dispatch({ type: GAMES_HAS_MORE, payload: true });
      }
    } else {
      dispatch({ type: GAMES_HAS_MORE, payload: false });
    }
  });
};

const getSports = async dispatch => {
  const response = await tracker.get(`/sports`);
  dispatch({ type: GET_SPORTS, payload: response.data });
};

const getGames = async (_page, _limit, dispatch) => {
  const response = await tracker.get(`/games`, {
    params: {
      _sort: "started",
      _order: "desc",
      _page,
      _limit,
    },
  });
  dispatch({ type: GET_GAMES_BY_PAGE, payload: response.data });
  return response.headers.link;
};
