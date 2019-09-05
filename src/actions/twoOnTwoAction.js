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
  const response = await tracker.post(`/games`, formValues);
  dispatch({ type: GAME_CREATED, payload: response.data });
  // await tracker.post("/log", { ...values, action: "create game" });
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

const getPlayers = async (sportId, dispatch) => {
  dispatch({
    type: PLAYERS_REQUESTED,
  });

  const response = await tracker.get(`/players`, {
    params: { fields: ["name", "id"], where: { sportId } },
  });
  dispatch({
    type: PLAYERS_RETURNED,
    payload: response.data,
  });
};
