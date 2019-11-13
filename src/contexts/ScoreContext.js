import _ from "lodash";
import React, { useState, useEffect } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { getGamesFromRecords } from "../helpers/games";

export const ScoreContext = React.createContext();

const ScoreProvider = props => {
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [scored, setScored] = useState(0);

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
      setGame(_.first(getGamesFromRecords(returnedGame)));
    };

    if (!!gameId) {
      getGame();
    } else {
      setGame(null);
    }
  }, [gameId, scored]);

  const state = {
    game,
    setGameId,
    setScored,
  };

  return (
    <ScoreContext.Provider value={state}>
      {props.children}
    </ScoreContext.Provider>
  );
};

export default ScoreProvider;
