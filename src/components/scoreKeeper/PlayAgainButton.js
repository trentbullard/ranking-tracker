import _ from "lodash";
import React, { useContext } from "react";
import { Button } from "semantic-ui-react";
import { ScoreContext } from "../../contexts/ScoreContext";
import { FlashContext } from "../../contexts/FlashContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getDigest } from "../../helpers/hmac";
import tracker from "../../apis/tracker";
import { log } from "../../helpers/log";
import history from "../../history";

const PlayAgainButton = _props => {
  const { gameOver, teams, sport, setGameId, loading, setLoading } = useContext(ScoreContext);
  const { currentUser } = useContext(AuthContext);
  const { addFlash } = useContext(FlashContext);

  const handleClick = async event => {
    event.preventDefault();
    setLoading(true);

    const newGameData = {
      teams,
      sport: sport.id,
      eloAwarded: false,
      started: new Date().toISOString(),
    };

    try {
      const { data } = await tracker.post(`/games`, newGameData, {
        params: {
          token: getDigest("post", "/games"),
        },
      });
      const returnedGame = await data;
      if (_.isEmpty(returnedGame) || !_.isEmpty(returnedGame.error)) {
        addFlash("failed to create new game");
      }
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
  };

  if (gameOver) {
    return (
      <div className="play-again-button">
        <Button
          disabled={loading}
          positive
          onClick={handleClick}
          content="Play Again"
        />
      </div>
    );
  }
  return null;
};

export default PlayAgainButton;
