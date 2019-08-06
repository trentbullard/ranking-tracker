import _ from "lodash-es";
import history from "../history";
import {
  GAME_REQUESTED,
  GAME_RETURNED,
  GAME_CREATED,
  GAME_FETCH_ERROR,
  SPORT_REQUESTED,
  SPORT_RETURNED,
  PLAYERS_REQUESTED,
  PLAYERS_RETURNED,
  SCORE_GOAL,
} from "./types";
import tracker from "../apis/tracker";

export const getScoreKeeperData = gameId => (dispatch, getState) => {
  getGame(gameId, dispatch).then(
    () => {
      let game = getState().scoreKeeper.game[gameId];
      if (!game) {
        throw { message: "Game not found" };
      }
      getSport(game.sport, dispatch);
      let teams = Object.values(game.teams);
      let playerNames = _.flatten(
        _.map(teams, position => {
          return _.map(Object.values(position), player => {
            return player.name;
          });
        }),
      );
      getPlayersByName(playerNames, dispatch);
    },
    error => {
      dispatch({ type: GAME_FETCH_ERROR, message: error.message });
    },
  );
};

export const scoreGoal = (player, game) => (dispatch, getState) => {
  if (getState().scoreKeeper.updateRequested) {
    return null;
  }
  let teamName;
  let positionName;
  let goals;
  _.each(game.teams, (team, teamKey) => {
    _.each(team, (position, positionKey) => {
      if (player.name === position.name) {
        teamName = teamKey;
        positionName = positionKey;
        goals = position.score;
      }
    });
  });
  let updatedGame = _.set(
    { ...game },
    `teams.${teamName}.${positionName}.score`,
    goals + 1,
  );
  return updateGame(game, updatedGame, "score goal", dispatch);
};

export const playAgain = game => (dispatch, getState) => {
  if (getState().scoreKeeper.gameCreationRequested) {
    return null;
  }
  let { id, ...updatedGame } = { ...game };
  _.each(game.teams, (team, teamKey) => {
    _.each(team, (position, positionKey) => {
      _.set(updatedGame, `teams.${teamKey}.${positionKey}.score`, 0);
    });
  });
  createGame(updatedGame, dispatch)
    .then(action => {
      history.push(`/games/score/${action.payload.id}`);
      return action.payload.id;
    })
    .then(id => {
      getScoreKeeperData(id);
    });
};

const getGame = async (id, dispatch) => {
  dispatch({
    type: GAME_REQUESTED,
  });

  const response = await tracker.get(`/games`, {
    params: {
      id,
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
    },
  });
  dispatch({
    type: SPORT_RETURNED,
    payload: response.data,
  });
};

const getPlayersByName = async (names, dispatch) => {
  dispatch({
    type: PLAYERS_REQUESTED,
  });

  const response = await tracker.get(`/players`, {
    params: {
      name: names,
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
  const response = await tracker.post(`/games`, {
    ...noIdValues,
  });
  await tracker.post("/logs", { ...noIdValues, action: "create game" });
  return dispatch({ type: GAME_CREATED, payload: response.data });
};

const updateGame = async (game, values, action, dispatch) => {
  const response = await tracker.patch(`/games/${game.id}`, { ...values });
  const { id, ...logValues } = values;
  await tracker.post(`/logs`, { ...logValues, game: game.id, action });
  dispatch({ type: SCORE_GOAL, payload: response.data });
};
