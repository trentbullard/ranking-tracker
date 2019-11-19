import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { ScoreContext } from "../../contexts/ScoreContext";
import ScoreButtons from "./ScoreButtons";

const COLORS = [
  { Green: "#21ba45" },
  { Orange: "#f2711c" },
  { Red: "#db2828" },
  { Blue: "#2185d0" },
];

const TeamColumn = ({ team, color, left, disabled }) => {
  const { sport, setGameOver } = useContext(ScoreContext);
  const [winningScore, setWinningScore] = useState(0);
  const [teamScore, setTeamScore] = useState(0);
  const [playerScores, setPlayerScores] = useState({});
  const colorCode = Object.values(color)[0];
  const colorName = Object.keys(color)[0].toLowerCase();

  // set winning score
  useEffect(() => {
    const { winningScore: score } = sport;
    setWinningScore(score);
  }, [sport]);

  // update team score
  useEffect(() => {
    setTeamScore(
      _.reduce(Object.values(playerScores), (acc, score) => acc + score, 0),
    );
  }, [playerScores]);

  // set game over
  useEffect(() => {
    if (!!winningScore && teamScore >= winningScore) {
      setGameOver(true);
    }
  }, [teamScore, winningScore, setGameOver]);

  return (
    <div className="team-column">
      <div className="team-heading">
        <div className="team-name" style={{ color: colorCode }}>
          {team.name}
        </div>
        <div className="team-score">{teamScore}</div>
      </div>
      <div className="team-buttons">
        <ScoreButtons
          team={team}
          setPlayerScores={setPlayerScores}
          buttonColor={colorName}
          textColor={colorCode}
          left={left}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

const TeamColumns = _props => {
  const {
    game: { teams },
    gameOver,
    loading,
  } = useContext(ScoreContext);

  return _.map(teams, (team, index) => {
    const color =
      _.find(COLORS, c => {
        return !!c[team.name];
      }) || COLORS[index];
    return (
      <TeamColumn
        team={team}
        color={color}
        left={!!index}
        disabled={loading || gameOver}
        key={`team-column-${index}`}
      />
    );
  });
};

export default TeamColumns;
