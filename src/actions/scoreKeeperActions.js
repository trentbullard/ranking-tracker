import _ from "lodash-es";
import history from "../history";
import {
  GAME_REQUESTED,
  GAME_RETURNED,
  GAME_CREATED,
  SPORT_REQUESTED,
  SPORT_RETURNED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  DATA_LOADING,
  DATA_LOADED,
} from "./types";
import tracker from "../apis/tracker";
import { getNewElos } from "../helpers/elo";

export const getScoreKeeperData = gameId => async (dispatch, getState) => {
  dispatch({ type: DATA_LOADING });
  await getGame(gameId, dispatch);
  let game = getState().scoreKeeper.game;
  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }
  await getSport(game.sport, dispatch);
  let teams = Object.values(game.teams);
  let playerNames = _.flatten(
    _.map(teams, position => {
      return _.map(Object.values(position), player => {
        return player.name;
      });
    }),
  );
  await getPlayersByName(game.sport, playerNames, dispatch);
  dispatch({ type: DATA_LOADED });
};

export const scoreGoal = (teamPlayerId, newScore) => async getState => {
  await tracker.patch("/goal", {
    teamPlayerId,
    newScore,
  });
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

export const updateElos = (sport, teams) => async (dispatch, getState) => {
  let [team1, team2] = teams;
  let [wTeam, lTeam] = [{}, {}];
  if (team1.positions[0].player.score + team1.positions[1].player.score >= 10) {
    wTeam = team1;
    lTeam = team2;
  } else {
    wTeam = team2;
    lTeam = team1;
  }
  let updatedElos = getNewElos(wTeam, lTeam, sport);
  await tracker.patch("/elos", {
    sport,
    updatedElos,
  });
};

const getGame = async (id, dispatch) => {
  dispatch({
    type: GAME_REQUESTED,
  });

  const response = await tracker.get(`/games/${id}`);
  dispatch({
    type: GAME_RETURNED,
    payload: response.data,
  });
};

const getSport = async (id, dispatch) => {
  dispatch({
    type: SPORT_REQUESTED,
  });

  const response = await tracker.get(`/sports/${id}`);
  dispatch({
    type: SPORT_RETURNED,
    payload: response.data,
  });
};

const getPlayersByName = async (sportId, names, dispatch) => {
  dispatch({
    type: PLAYERS_REQUESTED,
  });

  const response = await tracker.get(`/players`, {
    params: {
      where: {
        name: names,
        sport: sportId,
      },
    },
  });
  dispatch({
    type: PLAYERS_RETURNED,
    payload: response.data,
  });
};

const createGame = async (values, dispatch) => {
  let { id, ...noIdValues } = {
    ...values,
    eloAwarded: false,
    started: new Date().toISOString(),
  };

  let gameCtr = 0;
  let response = {};
  while (gameCtr < 5) {
    try {
      response = await tracker.post(`/games`, {
        ...noIdValues,
      });
      dispatch({ type: GAME_CREATED, payload: response.data });
      gameCtr = 5;
    } catch (error) {
      console.log(`Failed to create game. Trying again`);
      gameCtr++;
    }
  }

  // let gameLogCtr = 0;
  // while (gameLogCtr < 5) {
  //   try {
  //     await tracker.post("/logs", { ...noIdValues, action: "create game" });
  //     gameLogCtr = 5;
  //   } catch (error) {
  //     console.log(`Failed to log game creation. Trying again`);
  //     gameLogCtr++;
  //   }
  // }
  return response.data;
};
