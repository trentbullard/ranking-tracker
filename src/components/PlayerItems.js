import _ from "lodash";
import React from "react";

const PlayerItems = ({ teams, winningScore, gameId }) => {
  return _.map(teams, (team, index) => {
    const positions = team.positions;
    const teamScore = _.reduce(
      positions,
      (sum, p) => {
        return sum + p.player.score;
      },
      0,
    );
    const teamString = `${positions[0].player.name} & ${positions[1].player.name}: ${teamScore}`;
    const teamElement =
      teamScore >= winningScore ? <b>{teamString}</b> : teamString;
    return (
      <div className="item" key={`${gameId}-${index}`}>
        {teamElement}
      </div>
    );
  });
};

export default PlayerItems;
