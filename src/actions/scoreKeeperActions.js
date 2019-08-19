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
  UPDATE_GAME,
  POST_GAME_ACTION_STARTED,
  POST_GAME_ACTION_COMPLETED,
  UPDATE_PLAYER,
} from "./types";
import tracker from "../apis/tracker";
import { getNewElos } from "../helpers/elo";

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

export const scoreGoal = (player, game) => async (dispatch, getState) => {
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
  let updatedGame = {
    teams: {
      ...game.teams,
      [teamName]: {
        ...game.teams[teamName],
        [positionName]: {
          ...game.teams[teamName][positionName],
          score: goals + 1,
        },
      },
    },
  };

  const result = await updateGame(game.id, updatedGame, "score goal", dispatch);
  if (!result) {
    return null
  }
  let sport = getState().scoreKeeper.sport[result.sport];
  let wTeam;
  let lTeam;
  let gameOver = _.map(result.teams, (positions, teamName_1) => {
    if (
      Object.values(positions)[0].score + Object.values(positions)[1].score >=
      sport.winningScore
    ) {
      wTeam = { [teamName_1]: positions };
      return true;
    } else {
      lTeam = { [teamName_1]: positions };
      return false;
    }
  }).some(winning => {
    return winning;
  });
  if (gameOver) {
    let postGameValues = {
      wTeam: { ...wTeam },
      lTeam: { ...lTeam },
      id: result.id,
    };
    postGameAction(postGameValues, sport, dispatch);
  }
};

export const playAgain = (game, players) => async (dispatch, getState) => {
  if (getState().scoreKeeper.gameCreationRequested) {
    return null;
  }
  let { id, ...updatedGame } = { ...game };
  _.each(game.teams, (team, teamKey) => {
    _.each(team, (position, positionKey) => {
      _.set(updatedGame, `teams.${teamKey}.${positionKey}.score`, 0);
      _.set(
        updatedGame,
        `teams.${teamKey}.${positionKey}.elo`,
        _.mapKeys(players, "id")[position.id].elo,
      );
    });
  });
  const result = await createGame(updatedGame, dispatch)
  if (!result) {
    return null;
  }
  history.push(`/games/score/${result.id}`);
  getScoreKeeperData(result.id);
};

const postGameAction = async (game, sport, dispatch) => {
  dispatch({ type: POST_GAME_ACTION_STARTED });
  let wTeam = game.wTeam;
  let lTeam = game.lTeam;
  let { wPlayer1, wPlayer2, lPlayer1, lPlayer2 } = getNewElos(
    wTeam,
    lTeam,
    sport,
  );

  let wP1Ctr = 0;
  while (wP1Ctr < 5) {
    try {
      const wPlayer1Response = await tracker.patch(`/players/${wPlayer1.id}`, {
        elo: wPlayer1.elo,
      });
      dispatch({ type: UPDATE_PLAYER, payload: wPlayer1Response.data });
      wP1Ctr = 5;
    } catch (err) {
      console.log(
        `Failed to update ${wPlayer1.name}'s elo to ${
          wPlayer1.elo
        }. Trying again`,
      );
      console.log(`TCL: wP1Ctr`, wP1Ctr);
      wP1Ctr++;
    }
  }

  let wP2Ctr = 0;
  while (wP2Ctr < 5) {
    try {
      const wPlayer2Response = await tracker.patch(`/players/${wPlayer2.id}`, {
        elo: wPlayer2.elo,
      });
      dispatch({ type: UPDATE_PLAYER, payload: wPlayer2Response.data });
      wP2Ctr = 5;
    } catch (err) {
      console.log(
        `Failed to update ${wPlayer2.name}'s elo to ${
          wPlayer2.elo
        }. Trying again`,
      );
      console.log(`TCL: wP2Ctr`, wP2Ctr);
      wP2Ctr++;
    }
  }

  let lP1Ctr = 0;
  while (lP1Ctr < 5) {
    try {
      const lPlayer1Response = await tracker.patch(`/players/${lPlayer1.id}`, {
        elo: lPlayer1.elo,
      });
      dispatch({ type: UPDATE_PLAYER, payload: lPlayer1Response.data });
      lP1Ctr = 5;
    } catch (err) {
      console.log(
        `Failed to update ${lPlayer1.name}'s elo to ${
          lPlayer1.elo
        }. Trying again`,
      );
      console.log(`TCL: lP1Ctr`, lP1Ctr);
      lP1Ctr++;
    }
  }

  let lP2Ctr = 0;
  while (lP2Ctr < 5) {
    try {
      const lPlayer2Response = await tracker.patch(`/players/${lPlayer2.id}`, {
        elo: lPlayer2.elo,
      });
      dispatch({ type: UPDATE_PLAYER, payload: lPlayer2Response.data });
      lP2Ctr = 5;
    } catch (err) {
      console.log(
        `Failed to update ${lPlayer2.name}'s elo to ${
          lPlayer2.elo
        }. Trying again`,
      );
      console.log(`TCL: lP2Ctr`, lP2Ctr);
      lP2Ctr++;
    }
  }

  let updatedGame = _.omit(game, ["wTeam", "lTeam"]);
  updateGame(
    game.id,
    { ...updatedGame, eloAwarded: true },
    "award elo",
    dispatch,
  );

  dispatch({ type: POST_GAME_ACTION_COMPLETED });
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

  let gameCtr = 0;
  let response = {};
  while (gameCtr < 5) {
    try {
      const response = await tracker.post(`/games`, {
        ...noIdValues,
      });
      dispatch({ type: GAME_CREATED, payload: response.data });
      gameCtr = 5
    } catch (error) {
      console.log(`Failed to create game. Trying again`);
      gameCtr++;
    }
  }

  let gameLogCtr = 0;
  while (gameLogCtr < 5) {
    try {
      await tracker.post("/logs", { ...noIdValues, action: "create game" });
      gameLogCtr = 5
    } catch (error) {
      console.log(`Failed to log game creation. Trying again`);
      gameLogCtr++;
    }
  }
  return response.data;
};

const updateGame = async (gameId, values, action, dispatch) => {
  let gameCtr = 0;
  let response = {};
  while (gameCtr < 5) {
    try {
      response = await tracker.patch(`/games/${gameId}`, values);
      dispatch({ type: UPDATE_GAME, payload: response.data });
      gameCtr = 5
    } catch (error) {
      console.log(`Failed to update game. Trying again`);
      gameCtr++;
    }
  }

  let gameLogCtr = 0;
  while (gameLogCtr < 5) {
    try {
      await tracker.post(`/logs`, { ...values, game: gameId, action });
      gameLogCtr = 5;
    } catch (error) {
      console.log(`Failed to log game update. Trying again`);
      gameLogCtr++;
    }
  }

  return response.data;
};
