import _ from "lodash";
import React, { useState, useEffect } from "react";
import ScoreButton from "./ScoreButton";

const ScoreButtons = ({
  buttonColor,
  positions,
  disabled,
  left,
}) => {
  return _.map(positions, position => {
    return (
      <ScoreButton
        player={position.player}
        buttonColor={buttonColor}
        disabled={disabled}
        left={left}
        key={position.player.name}
      />
    );
  });
};

const TeamColumn = ({ team, color, left, disabled }) => {
  const [teamScore, setTeamScore] = useState(0);
  const [teamName, setTeamName] = useState("");
  const colorName = !!color[team.name]
    ? team.name.toLowerCase()
    : Object.keys(color)[0].toLowerCase();
  const colorCode = color[team.name] || Object.values(color)[0];

  // set team state
  useEffect(() => {
    if (!!team) {
      const { positions, name } = team;
      setTeamName(name);
      setTeamScore(
        _.reduce(
          positions,
          (acc, position) => {
            return acc + position.player.score;
          },
          0,
        ),
      );
    }
  }, [team]);

  return (
    <div className="team-column">
      <div className="team-heading">
        <div className="team-name" style={{ color: colorCode }}>
          {teamName}
        </div>
        <div className="team-score">{teamScore}</div>
      </div>
      <div className="team-buttons">
        <ScoreButtons
          buttonColor={colorName}
          positions={team.positions}
          left={left}
          disabled={_.isEmpty(team) || disabled}
        />
      </div>
    </div>
  );
};

export default TeamColumn;
