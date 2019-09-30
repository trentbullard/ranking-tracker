import React, { useState } from "react";

export const ScoreContext = React.createContext();

const ScoreProvider = props => {
  const [scores, setScores] = useState(null);
  const [game, setGame] = useState(null);

  const state = {
    scores,
    setScores,
    game,
    setGame,
  };

  return (
    <ScoreContext.Provider value={state}>
      {props.children}
    </ScoreContext.Provider>
  );
};

export default ScoreProvider;
