import _ from "lodash";
import React from "react";
import Loading from "../utility/Loading";

const GameHistory = ({ games }) => {
  if (_.isEmpty(games)) {
    return <Loading active />;
  }

  return (
    <>
      <h2 className="ui header">Game History</h2>
      <ul>
        {_.map(games, game => {
          return (
            <li key={`game-history-${game.id}`}>
              {game.id} | {JSON.stringify(game)}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default GameHistory;
