import _ from "lodash";
import React, { useState, useEffect, useContext, useCallback } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { getNewElos } from "../helpers/elo";
import { log } from "../helpers/log";
import { AuthContext } from "./AuthContext";

export const ScoreContext = React.createContext();

const updateElos = async (teams, sport, game, currentUser) => {
  if (_.isEmpty(teams) || !sport || !game || !currentUser || game.eloAwarded) {
    return null;
  }
  const { id: sportId } = sport;
  const { id: gameId } = game;
  let wTeam;
  let lTeam;
  _.each(teams, team => {
    const teamScore = _.reduce(
      team.positions,
      (acc, position) => {
        return acc + position.player.score;
      },
      0,
    );
    if (teamScore === parseInt(sport.winningScore)) {
      wTeam = team;
    } else {
      lTeam = team;
    }
  });
  if (!!wTeam && !!lTeam) {
    const updatedElos = getNewElos(wTeam, lTeam, sport);
    const body = {
      sportId,
      gameId,
      updatedElos,
    };

    await tracker.patch("/elos", body, {
      params: {
        token: getDigest("patch", "/elos"),
      },
    });
    const { id: userId } = currentUser;
    log("ELOS_UPDATED", gameId, { teams }, null, "games", userId);
  }
};

const ScoreProvider = props => {
  const { currentUser } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [sport, setSport] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameTeams, setGameTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [playersLoaded, setPlayersLoaded] = useState(0);

  // fetch game and teams
  useEffect(() => {
    const getGame = async () => {
      const { data } = await tracker.get(`/games/${gameId}`, {
        params: {
          token: getDigest("get", "/games/:id"),
        },
      });
      const returnedGame = await data;
      setGame(returnedGame);
    };

    const getGameTeams = async () => {
      const { data } = await tracker.get(`/games/${gameId}/teams`, {
        params: {
          token: getDigest("get", "/games/:id/teams"),
        },
      });
      const returnedGameTeams = await data;
      setGameTeams(returnedGameTeams);
    };

    if (!!gameId) {
      getGame();
      getGameTeams();
    } else {
      setPlayersLoaded(0);
      setGameTeams([]);
      setGame(null);
      setGameOver(false);
    }
  }, [gameId]);

  // loading if no game teams
  useEffect(() => {
    if (_.isEmpty(gameTeams)) {
      setLoading(true);
    }
  }, [gameTeams]);

  // not loading if all players are loaded
  useEffect(() => {
    if (!!sport) {
      const { teamNames, playersPerTeam } = sport;
      const totalPlayersRequired = teamNames.split(",").length * playersPerTeam;
      if (playersLoaded > 0 && playersLoaded % totalPlayersRequired === 0) {
        setLoading(false);
      }
    }
  }, [playersLoaded, sport]);

  // set play again data
  useEffect(() => {
    if (!!sport) {
      const { teamNames, positionNames } = sport;
      setTeams(
        _.map(teamNames.split(","), teamName => {
          return {
            name: teamName,
            positions: _.map(positionNames.split(","), positionName => {
              return {
                name: positionName,
                score: 0,
                player: {},
              };
            }),
          };
        }),
      );
    }
  }, [sport]);

  const memoizedUpdateElos = useCallback(() => {
    updateElos(teams, sport, game, currentUser);
  }, [teams, sport, game, currentUser]);

  const state = {
    game,
    gameTeams,
    setGameId,
    setSport,
    sport,
    gameOver,
    setGameOver,
    loading,
    setLoading,
    teams,
    setTeams,
    setPlayersLoaded,
    updateElos: memoizedUpdateElos,
  };

  return (
    <ScoreContext.Provider value={state}>
      {props.children}
    </ScoreContext.Provider>
  );
};

export default ScoreProvider;
