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

export const getTwoOnTwoFormData = sportId => dispatch => {
  getSport(sportId, dispatch).then(() => {
    getPlayers(dispatch);
  });
};

export const createTwoOnTwoGame = formValues => dispatch => {
  createGame(formValues, dispatch).then(gameId => {
    history.push(`/games/score/${gameId}`);
  });
};

const createGame = async (formValues, dispatch) => {
  let values = {
    ...formValues,
    eloAwarded: false,
    started: new Date().toISOString(),
  };
  dispatch({ type: GAME_CREATION_REQUESTED });
  const response = await tracker.post(`/games`, values);
  dispatch({ type: GAME_CREATED, payload: response.data });
  await tracker.post("/logs", { ...values, action: "create game" });
  return response.data.id;
};

const getSport = async (id, dispatch) => {
  dispatch({
    type: SPORT_REQUESTED,
  });

  const response = await tracker.get(`/sports`, {
    params: {
      id,
    },
  });
  dispatch({
    type: SPORT_RETURNED,
    payload: response.data,
  });
};

const getPlayers = async dispatch => {
  dispatch({
    type: PLAYERS_REQUESTED,
  });

  const response = await tracker.get(`/players`);
  dispatch({
    type: PLAYERS_RETURNED,
    payload: response.data,
  });
};
