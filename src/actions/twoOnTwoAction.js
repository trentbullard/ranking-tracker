import history from "../history";
import {
  GAME_CREATED,
  SPORT_REQUESTED,
  SPORT_RETURNED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  GAME_CREATION_REQUESTED,
} from "./types";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";

export const getTwoOnTwoFormData = sportId => dispatch => {
  getSport(sportId, dispatch).then(() => {
    getPlayers(sportId, dispatch);
  });
};

export const createTwoOnTwoGame = formValues => dispatch => {
  createGame(formValues, dispatch).then(gameId => {
    history.push(`/games/score/${gameId}`);
  });
};

const createGame = async (formValues, dispatch) => {
  dispatch({ type: GAME_CREATION_REQUESTED });
  const response = await tracker.post(`/games`, formValues, {
    params: { token: getDigest("post", "/games") },
  });
  dispatch({ type: GAME_CREATED, payload: response.data });
  await tracker.post(
    "/logs",
    {
      actionType: GAME_CREATED,
      objectType: "games",
      objectId: response.data.id,
      objectJson: JSON.stringify(response.data),
    },
    { params: { token: getDigest("post", "/logs") } },
  );
  return response.data.id;
};

const getSport = async (id, dispatch) => {
  dispatch({
    type: SPORT_REQUESTED,
  });

  const response = await tracker.get(`/sports`, {
    params: {
      id,
      token: getDigest("get", "/sports"),
    },
  });
  dispatch({
    type: SPORT_RETURNED,
    payload: response.data,
  });
};

const getPlayers = async (sportId, dispatch) => {
  dispatch({
    type: PLAYERS_REQUESTED,
  });

  const response = await tracker.get(`/players`, {
    params: { sportId, token: getDigest("get", "/players") },
  });
  dispatch({
    type: PLAYERS_RETURNED,
    payload: response.data,
  });
};
