import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import tracker from "../../apis/tracker";
import { getDigest } from "../../helpers/hmac";
import { ScoreContext } from "../../contexts/ScoreContext";
import ScoreButtons from "./ScoreButtons";
import Loading from "../utility/Loading";

const COLORS = [
  { Green: "#21ba45" },
  { Orange: "#f2711c" },
  { Red: "#db2828" },
  { Blue: "#2185d0" },
];

const TeamColumn = ({ gameTeam, index, left, disabled }) => {
  const { sport, setGameOver, setTeams } = useContext(ScoreContext);
  const [team, setTeam] = useState(null);
  const [winningScore, setWinningScore] = useState(0);
  const [teamScore, setTeamScore] = useState(0);
  const [playerScores, setPlayerScores] = useState({});
  const [colorCode, setColorCode] = useState("");
  const [colorName, setColorName] = useState("");

  // get team
  useEffect(() => {
    const getTeam = async id => {
      const { data } = await tracker.get(`/teams/${id}`, {
        params: {
          token: getDigest("get", "/teams/:id"),
        },
      });
      const returnedTeam = await data;
      setTeam(returnedTeam);
    };

    if (!!gameTeam) {
      const { teamId } = gameTeam;
      getTeam(teamId);
    }
  }, [gameTeam, setTeams]);

  // set winning score
  useEffect(() => {
    const { winningScore } = sport;
    setWinningScore(winningScore);
  }, [sport]);

  // update team score
  useEffect(() => {
    if (!_.isEmpty(playerScores)) {
      setTeamScore(
        _.reduce(
          Object.values(playerScores),
          (acc, score) => {
            return acc + score;
          },
          0,
        ),
      );
    }
  }, [playerScores]);

  // set game over
  useEffect(() => {
    if (winningScore > 0 && teamScore >= winningScore) {
      setGameOver(true);
    }
  }, [teamScore, winningScore, setGameOver]);

  // set team color
  useEffect(() => {
    if (!!team) {
      const { name } = team;
      const color =
        _.find(COLORS, c => {
          return !!c[name];
        }) || COLORS[index];
      setColorCode(Object.values(color)[0]);
      setColorName(Object.keys(color)[0]);
    }
  }, [team, index]);

  if (!team) {
    return <Loading />;
  }

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
  const { gameTeams, gameOver, loading, updateElos, game } = useContext(
    ScoreContext,
  );
  const [teams, setTeams] = useState([]);
  const [elosUpdated, setElosUpdated] = useState(null);

  // re-render component when gameTeams loads
  useEffect(() => {
    setTeams(gameTeams);
  }, [gameTeams]);

  // update elos when game is over
  useEffect(() => {
    if (gameOver && !loading && elosUpdated !== game.id) {
      updateElos();
      setElosUpdated(g => game.id);
    }
  }, [loading, gameOver, updateElos, game, elosUpdated]);

  return _.map(teams, (gameTeam, index) => {
    return (
      <TeamColumn
        gameTeam={gameTeam}
        index={index}
        left={!!index}
        disabled={loading || gameOver}
        key={`team-column-${index}`}
      />
    );
  });
};

export default TeamColumns;
