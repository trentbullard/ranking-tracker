import history from "../history";
import {
  GAME_REQUESTED,
  GAME_RETURNED,
  GAME_CREATED,
  SPORT_REQUESTED,
  SPORT_RETURNED,
  DATA_LOADING,
  DATA_LOADED,
} from "./types";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { getNewElos } from "../helpers/elo";

export const getScoreKeeperData = gameId => async (dispatch, getState) => {
  dispatch({ type: DATA_LOADING });
  await getGame(gameId, dispatch);
  let game = getState().scoreKeeper.game;
  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }
  await getSport(game.sport, dispatch);
  dispatch({ type: DATA_LOADED });
};

export const scoreGoal = (teamPlayerId, newScore) => async getState => {
  await tracker.patch(
    "/goal",
    {
      teamPlayerId,
      newScore,
    },
    {
      params: {
        token: getDigest("patch", "/goal"),
      },
    },
  );
};

export const playAgain = game => async (dispatch, getState) => {
  if (getState().scoreKeeper.gameCreationRequested) {
    return null;
  }
  const response = await createGame(game, dispatch);
  if (!response) {
    return null;
  }
  await getGame(response.id, dispatch);
  history.push(`/games/score/${response.id}`);
};

export const updateElos = (sport, game) => async (dispatch, getState) => {
  let gameId = game.id;
  let [team1, team2] = game.teams;
  let [wTeam, lTeam] = [{}, {}];
  if (team1.positions[0].player.score + team1.positions[1].player.score >= 10) {
    wTeam = team1;
    lTeam = team2;
  } else {
    wTeam = team2;
    lTeam = team1;
  }
  let updatedElos = getNewElos(wTeam, lTeam, sport);
  await tracker.patch(
    "/elos",
    {
      sport,
      updatedElos,
      gameId,
    },
    {
      params: {
        token: getDigest("patch", "/elos"),
      },
    },
  );
  await tracker.post(
    "/logs",
    {
      actionType: "UPDATE_ELOS",
      objectType: "games",
      objectId: gameId,
      objectJson: JSON.stringify(updatedElos),
    },
    { params: { token: getDigest("post", "/logs") } },
  );
};

const getGame = async (id, dispatch) => {
  dispatch({
    type: GAME_REQUESTED,
  });

  const response = await tracker.get(`/games`, {
    params: {
      id,
      sort: ["id"],
      order: ["asc"],
      token: getDigest("get", "/games"),
    },
  });
  dispatch({
    type: GAME_RETURNED,
    payload: response.data,
  });
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

const createGame = async (values, dispatch) => {
  let { id, ...noIdValues } = {
    ...values,
    eloAwarded: false,
    started: new Date().toISOString(),
  };

  const response = await tracker.post(
    `/games`,
    {
      ...noIdValues,
    },
    {
      params: {
        token: getDigest("post", "/games"),
      },
    },
  );
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
  return response.data;
};
