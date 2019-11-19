import React, { useState, useEffect } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { getGamesFromRecords } from "../helpers/games";

export const ScoreContext = React.createContext();

const ScoreProvider = props => {
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [sport, setSport] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  // fetch game
  useEffect(() => {
    const getGame = async () => {
      const { data } = await tracker.get(`/games`, {
        params: {
          id: gameId,
          sort: ["id"],
          order: ["asc"],
          token: getDigest("get", "/games"),
        },
      });
      const returnedGame = await data;
      const compiledGameDetails = getGamesFromRecords(returnedGame)[0];
      setGame(compiledGameDetails);
    };

    if (!!gameId) {
      getGame();
    } else {
      setGame(null);
    }
  }, [gameId]);

  const state = {
    game,
    setGameId,
    setSport,
    sport,
    gameOver,
    setGameOver,
    loading,
    setLoading,
  };

  return (
    <ScoreContext.Provider value={state}>
      {props.children}
    </ScoreContext.Provider>
  );
};

export default ScoreProvider;
