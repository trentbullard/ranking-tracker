import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import tracker from "../../apis/tracker";
import ScoreProvider, { ScoreContext } from "../../contexts/ScoreContext";
import { getGamesFromRecords } from "../../helpers/games";
import { getDigest } from "../../helpers/hmac";
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
  const { game, setGame } = useContext(ScoreContext);
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
      setGame(null);
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

const ScoreButton = props => {
  const [disabled, setDisabled] = useState(true);
  const [currentPlayerTeamId, setCurrentPlayerTeamId] = useState(null);
  const [currentPlayerScore, setCurrentPlayerScore] = useState(0);
  const [currentPlayerName, setCurrentPlayerName] = useState("");

  const linkClassName = `ui ${disabled ? "disabled" : ""} ${
    props.left
  } labeled button`;
  const nameClassName = `ui ${props.color} ${props.left} button`;
  const scoreClassName = `ui ${props.color} basic ${props.left} label`;

  // update disabled
  useEffect(() => {
    setDisabled(props.disabled || !currentPlayerTeamId);
  }, [currentPlayerTeamId, props.disabled]);

  // update player from props
  useEffect(() => {
    if (props.player) {
      const { teamPlayerId, name, score } = props.player;
      setCurrentPlayerTeamId(teamPlayerId);
      setCurrentPlayerScore(score);
      setCurrentPlayerName(name);
    }
  }, [props.player]);

  const handleClick = async event => {
    event.preventDefault();
    const alreadyDisabled = disabled;
    setDisabled(true);
    await tracker.patch(
      "/goal",
      {
        teamPlayerId: currentPlayerTeamId,
        newScore: currentPlayerScore + 1,
      },
      {
        params: {
          token: getDigest("patch", "/goal"),
        },
      },
    );
    props.setScored(s => s + 1);
    setDisabled(alreadyDisabled);
  };

  return (
    <div
      className={linkClassName}
      style={{ maxWidth: "100%", minWidth: "100%", margin: "0 0 2em" }}
      onClick={handleClick}
    >
      <div
        className={nameClassName}
        style={{ maxWidth: "70%", minWidth: "70%" }}
      >
        {currentPlayerName}
      </div>
      <div
        className={scoreClassName}
        style={{ maxWidth: "30%", minWidth: "30%" }}
      >
        {currentPlayerScore}
      </div>
    </div>
  );
};

const TeamColumns = ({ teams }) => {
  if (_.isEmpty(teams)) {
    return <Loading />;
  }

  return _.map(teams, (team, index) => {
    const color =
      _.find(COLORS, c => {
        return !!c[team.name];
      }) || COLORS[index];
    return (
      <TeamColumn team={team} color={color} left={!!index} key={team.name} />
    );
  });
};

const ScoreKeeper = props => {
  const { game, setGame, scores, setScores } = useContext(ScoreContext);
  const { sports } = useContext(SportContext);
  const { currentUser } = useContext(AuthContext);

  const [disabled, setDisabled] = useState(true);
  const [sport, setSport] = useState(null);
  const [sportName, setSportName] = useState("");
  const [teamNames, setTeamNames] = useState([]);
  const [positionNames, setPositionNames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [wTeam, setWTeam] = useState(null);
  const [lTeam, setLTeam] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // get game from db
  useEffect(() => {
    const getGame = async () => {
      const { data } = await tracker.get(`/games`, {
        params: {
          id: props.match.params.id,
          sort: ["id"],
          order: ["asc"],
          token: getDigest("get", "/games"),
        },
      });
      const returnedGame = await data;
      setGame(_.first(getGamesFromRecords(returnedGame)));
    };

    getGame();
  }, [props.match.params.id, setGame, scores]);

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

  // update teamNames and positionNames
  useEffect(() => {
    if (!!sport && !_.isEmpty(teams)) {
      if (sport.playersPerTeam === 1) {
        setTeamNames(
          _.map(teams, team => {
            return team.name;
          }),
        );
        setPositionNames();
      }
    }
  }, [sport, teams]);

  // initialize scores
  useEffect(() => {
    if (
      !_.isEmpty(teamNames) &&
      !_.isEmpty(positionNames) &&
      _.isEmpty(scores)
    ) {
      _.each(teamNames, teamName => {
        _.each(positionNames, positionName => {
          setScores({ [teamName]: { [positionName]: 0 } });
        });
      });
    }
  }, [teamNames, positionNames, scores, setScores]);

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
        return acc || team.score >= winningScore;
      },
      false,
    );
    setGameOver(gameIsOver);
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
      <PlayAgainButton show={gameOver} setGame={setGame} />
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
