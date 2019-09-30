import _ from "lodash-es";
import React, { useContext, useEffect, useState } from "react";
import tracker from "../apis/tracker";
import { FlashContext } from "../contexts/FlashContext";
import ScoreProvider, { ScoreContext } from "../contexts/ScoreContext";
import { getGamesFromRecords } from "../helpers/games";
import { getDigest } from "../helpers/hmac";
import BackArrow from "./utility/BackArrow";
import history from "../history";

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
  const { addFlash } = useContext(FlashContext);
  const { scores, setGame, game } = useContext(ScoreContext);

  const [loading, setLoading] = useState(true);
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

  // get game data
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
      if (!!returnedGame && !!returnedGame.error) {
        addFlash(returnedGame.message);
        return null;
      } else if (_.isEmpty(returnedGame)) {
        addFlash("failed to get game records");
        return null;
      }
      const [game] = getGamesFromRecords(returnedGame);
      return game;
    };

    const getSport = async id => {
      const { data } = await tracker.get(`/sports/${id}`, {
        params: {
          token: getDigest("get", `/sports/:id`),
        },
      });
      const [returnedSport] = await data;
      if (!!returnedSport && !!returnedSport.error) {
        addFlash(returnedSport.message);
        return null;
      } else if (_.isEmpty(returnedSport)) {
        addFlash("failed to get sport");
        return null;
      }
      return returnedSport;
    };

    setLoading(true);
    getGame()
      .then(game => {
        setGame(game);
        return game.sport;
      })
      .then(sportId => {
        getSport(sportId).then(returnedSport => {
          setSport(returnedSport);
          setSportName(`- ${returnedSport.name}`);
        });
      })
      .then(() => {
        setLoading(false);
      });
  }, [addFlash, props.match.params.id, setGame, scores]);

  // update players from game
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

  // get team scores
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

  // game end condition check
  useEffect(() => {
    const { winningScore } = sport || { winningScore: 9999 };
    setGameOver(redTeamScore >= winningScore || blueTeamScore >= winningScore);
  }, [sport, redTeamScore, blueTeamScore]);

  // game disabled
  useEffect(() => {
    setDisabled(loading || gameOver);
  }, [gameOver, loading]);

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
    <ScoreProvider>
      <ScoreKeeper {...props} />
    </ScoreProvider>
  );
};

export default ScoreKeeperProvider;
