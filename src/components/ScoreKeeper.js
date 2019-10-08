import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import tracker from "../apis/tracker";
import ScoreProvider, { ScoreContext } from "../contexts/ScoreContext";
import { getGamesFromRecords } from "../helpers/games";
import { getDigest } from "../helpers/hmac";
import BackArrow from "./utility/BackArrow";
import history from "../history";
import { getNewElos } from "../helpers/elo";
import SportProvider, { SportContext } from "../contexts/SportContext";

const PlayAgainButton = props => {
  const { game } = useContext(ScoreContext);
  const [loading, setLoading] = useState(false);

  const handleClick = async event => {
    event.preventDefault();
    setLoading(true);
    let { id, ...noIdValues } = {
      ...game,
      eloAwarded: false,
      started: new Date().toISOString(),
    };

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

    await tracker.post(
      "/logs",
      {
        actionType: "GAME_CREATED",
        objectType: "games",
        objectId: returnedGame.id,
        objectJson: JSON.stringify(returnedGame),
      },
      { params: { token: getDigest("post", "/logs") } },
    );

    return returnedGame.id;
  };

  return props.show ? (
    <div className="ui center aligned header">
      <div
        className={`ui positive ${loading ? "disabled" : ""} button`}
        onClick={event =>
          handleClick(event).then(gameId => {
            history.push(`/games/score/${gameId}`);
          })
        }
      >
        Play Again
      </div>
    </div>
  ) : null;
};

const ScoreButton = props => {
  const { setScores } = useContext(ScoreContext);
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

  const handleClick = async _event => {
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
  };

  return (
    <div
      className={linkClassName}
      style={{ maxWidth: "100%", minWidth: "100%", margin: "0 0 2em" }}
      onClick={event =>
        handleClick(event).then(() => {
          setScores(scores => {
            return {
              ...scores,
              [currentPlayerTeamId]: currentPlayerScore + 1,
            };
          });
        })
      }
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

const ScoreKeeper = props => {
  const { setGame, game } = useContext(ScoreContext);
  const { sports } = useContext(SportContext);

  const [disabled, setDisabled] = useState(true);
  const [sport, setSport] = useState(null);
  const [sportName, setSportName] = useState("");
  const [redKeeper, setRedKeeper] = useState(null);
  const [redForward, setRedForward] = useState(null);
  const [blueKeeper, setBlueKeeper] = useState(null);
  const [blueForward, setBlueForward] = useState(null);
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
  }, [props.match.params.id, setGame]);

  useEffect(() => {
    if (game) {
      const { sport } = game;
      setSport(_.find(sports, { id: sport }));
    }
  }, [game, sports]);

  useEffect(() => {
    if (sport) {
      const { name } = sport;
      setSportName(sport.name);
    }
  }, [sport]);

  useEffect(() => {
    if (game) {
      const { teams } = game;

      const redTeam = _.find(teams, { name: "Red" });
      const redPositions = redTeam.positions;
      const redKeeperPosition = _.find(redPositions, { name: "Keeper" });
      const redForwardPosition = _.find(redPositions, { name: "Forward" });
      setRedKeeper(redKeeperPosition.player);
      setRedForward(redForwardPosition.player);

      const blueTeam = _.find(teams, { name: "Blue" });
      const bluePositions = blueTeam.positions;
      const blueKeeperPosition = _.find(bluePositions, { name: "Keeper" });
      const blueForwardPosition = _.find(bluePositions, { name: "Forward" });
      setBlueKeeper(blueKeeperPosition.player);
      setBlueForward(blueForwardPosition.player);
    }
  }, [game]);

  useEffect(() => {
    if (redKeeper && redForward && blueKeeper && blueForward) {
      const { score: redKeeperScore } = redKeeper;
      const { score: redForwardScore } = redForward;
      const { score: blueKeeperScore } = blueKeeper;
      const { score: blueForwardScore } = blueForward;
      setRedTeamScore(redKeeperScore + redForwardScore);
      setBlueTeamScore(blueKeeperScore + blueForwardScore);
    }
  }, [blueForward, blueKeeper, redForward, redKeeper]);

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
      await tracker.post(
        "/logs",
        {
          actionType: "UPDATE_ELOS",
          objectType: "games",
          objectId: game.id,
          objectJson: JSON.stringify(updatedElos),
        },
        { params: { token: getDigest("post", "/logs") } },
      );
    };

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
    const gameIsOver =
      redTeamScore >= winningScore || blueTeamScore >= winningScore;
    setGameOver(gameIsOver);

    if (gameIsOver) {
      const wTeam =
        redTeamScore >= winningScore
          ? { positions: [{ player: redKeeper }, { player: redForward }] }
          : { positions: [{ player: blueKeeper }, { player: blueForward }] };
      const lTeam =
        redTeamScore >= winningScore
          ? { positions: [{ player: blueKeeper }, { player: blueForward }] }
          : { positions: [{ player: redKeeper }, { player: redForward }] };

      updateElos(wTeam, lTeam);
    }
  }, [
    blueForward,
    blueKeeper,
    blueTeamScore,
    game,
    redForward,
    redKeeper,
    redTeamScore,
    sport,
  ]);

  useEffect(() => {
    setDisabled(gameOver);
  }, [gameOver]);

  return (
    <>
      <h3
        className="ui center aligned header"
        style={{ margin: "2em" }}
        key="scorekeeper-header"
      >
        Score Keeper {sportName}
      </h3>
      <div className="ui center aligned grid">
        <div className="center aligned two column row">
          <div className="column">
            <h4 className="ui center aligned header">Score: {redTeamScore}</h4>
            <ScoreButton player={redKeeper} color="red" disabled={disabled} />
            <ScoreButton player={redForward} color="red" disabled={disabled} />
          </div>
          <div className="column">
            <h4 className="ui center aligned header">Score: {blueTeamScore}</h4>
            <ScoreButton
              player={blueKeeper}
              color="blue"
              left
              disabled={disabled}
            />
            <ScoreButton
              player={blueForward}
              color="blue"
              left
              disabled={disabled}
            />
          </div>
        </div>
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
