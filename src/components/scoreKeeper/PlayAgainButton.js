import _ from "react";
import React, { useState, useContext } from "react";
import { Button } from "semantic-ui-react";
import { ScoreContext } from "../../contexts/ScoreContext";
import { FlashContext } from "../../contexts/FlashContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getDigest } from "../../helpers/hmac";
import tracker from "../../apis/tracker";
import { log } from "../../helpers/log";

const PlayAgainButton = _props => {
  const { game, gameOver } = useContext(ScoreContext);
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
    } catch (error) {
      console.log("failed to create new game: ", error.stack);
      addFlash("failed to create new game");
    }
    setLoading(false);
  };

  if (gameOver) {
    return (
      <Button
        disabled={loading}
        positive
        className="play-again-button"
        onClick={handleClick}
      >
        Play Again
      </Button>
    );
  }
  return null;
};

export default PlayAgainButton;
