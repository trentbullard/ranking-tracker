import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import tracker from "../../apis/tracker";
import { getDigest } from "../../helpers/hmac";
import ScoreProvider, { ScoreContext } from "../../contexts/ScoreContext";
import BackArrow from "../utility/BackArrow";
import history from "../../history";
import { getNewElos } from "../../helpers/elo";
import SportProvider, { SportContext } from "../../contexts/SportContext";
import { log } from "../../helpers/log";
import { FlashContext } from "../../contexts/FlashContext";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../utility/Loading";
import TeamColumn from "./TeamColumn";
import "../../styles/scoreKeeper/scoreKeeper.css";

const COLORS = [
  { Green: "#21ba45" },
  { Orange: "#f2711c" },
  { Red: "#db2828" },
  { Blue: "#2185d0" },
];

const PlayAgainButton = ({ show }) => {
  const { game, setGameId } = useContext(ScoreContext);
  const { currentUser } = useContext(AuthContext);
  const { addFlash } = useContext(FlashContext);
  const [loading, setLoading] = useState(false);

  const handleClick = async event => {
    event.preventDefault();
    setLoading(true);

    let { id, ...noIdValues } = {
      ...game,
      eloAwarded: false,
      started: new Date().toISOString(),
    };
    try {
      const { data } = await tracker.post(
        `/games`,
        {
          ...noIdValues,
        },
        {
          params: {
            token: getDigest("post", "/games"),
          },
        },
      );
      const returnedGame = await data;
      log(
        "GAME_CREATED",
        returnedGame.id,
        returnedGame,
        null,
        "games",
        currentUser.id,
      );
      setGameId(null);
      history.push(`/games/score/${returnedGame.id}`);
    } catch (error) {
      console.log("failed to create new game: ", error.stack);
      addFlash("failed to create new game");
    }
    setLoading(false);
  };

  return show ? (
    <div className="ui center aligned header">
      <div
        className={`ui positive ${loading ? "disabled" : ""} button`}
        onClick={handleClick}
      >
        Play Again
      </div>
    </div>
  ) : null;
};

const TeamColumns = ({ teams, disabled }) => {
  if (_.isEmpty(teams)) {
    return <Loading />;
  }

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
        disabled={disabled}
        key={team.name}
      />
    );
  });
};

const ScoreKeeper = props => {
  const { game, setGameId } = useContext(ScoreContext);
  const { sports } = useContext(SportContext);
  const { currentUser } = useContext(AuthContext);

  const [disabled, setDisabled] = useState(true);
  const [sport, setSport] = useState(null);
  const [sportName, setSportName] = useState("");
  const [teams, setTeams] = useState([]);
  const [wTeam, setWTeam] = useState(null);
  const [lTeam, setLTeam] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // set gameId
  useEffect(() => {
    setGameId(props.match.params.id);
  }, [props.match.params.id, setGameId]);

  // set sport from game
  useEffect(() => {
    if (game) {
      const { sport } = game;
      setSport(_.find(sports, { id: sport }));
    }
  }, [game, sports]);

  // set sport name from sport
  useEffect(() => {
    if (sport) {
      const { name } = sport;
      setSportName(name);
    }
  }, [sport]);

  // update teams
  useEffect(() => {
    if (!!game) {
      setTeams(game.teams);
    }
  }, [game]);

  // check game end
  useEffect(() => {
    if (!game) {
      return;
    }

    if (game.eloAwarded) {
      setGameOver(true);
      return;
    }

    if (!sport) {
      return;
    }

    const { winningScore } = sport;
    const gameIsOver = _.reduce(
      teams,
      (acc, team) => {
        const teamScore = _.reduce(
          team.positions,
          (acc2, position) => {
            return acc2 + position.player.score;
          },
          0,
        );
        if (teamScore >= winningScore) {
          setWTeam(team);
        } else {
          setLTeam(team);
        }
        return acc || teamScore >= winningScore;
      },
      false,
    );
    setGameOver(gameIsOver);
    if (gameIsOver) {
      setDisabled(true);
    }
  }, [game, sport, teams]);

  // update elos when game ends
  useEffect(() => {
    const updateElos = async (wTeam, lTeam) => {
      const updatedElos = getNewElos(wTeam, lTeam, sport);
      await tracker.patch(
        "/elos",
        {
          sport,
          updatedElos,
          gameId: game.id,
        },
        {
          params: {
            token: getDigest("patch", "/elos"),
          },
        },
      );
      log("UPDATE_ELOS", game.id, game, null, "games", currentUser.id);
    };
    setDisabled(gameOver);
    if (gameOver && !game.eloAwarded) {
      updateElos(wTeam, lTeam);
    }
  }, [currentUser.id, game, gameOver, lTeam, sport, wTeam]);

  return (
    <>
      <h3
        className="ui center aligned header"
        style={{ margin: "2em" }}
        key="scorekeeper-header"
      >
        Score Keeper {sportName}
      </h3>
      <div className="team-grid">
        <TeamColumns teams={teams} disabled={disabled} />
      </div>
      <PlayAgainButton show={gameOver} />
      <BackArrow url="/" />
    </>
  );
};

const ScoreKeeperProvider = props => {
  return (
    <SportProvider>
      <ScoreProvider>
        <ScoreKeeper {...props} />
      </ScoreProvider>
    </SportProvider>
  );
};

export default ScoreKeeperProvider;
