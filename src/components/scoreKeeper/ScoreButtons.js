import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Button, Label } from "semantic-ui-react";
import { getDigest } from "../../helpers/hmac";
import tracker from "../../apis/tracker";

const ScoreButton = ({
  teamPlayerId,
  setPlayerScores,
  left,
  buttonColor,
  textColor,
  disabled,
}) => {
  const [player, setPlayer] = useState(null);
  const [scored, setScored] = useState(0);
  const [selfDisabled, setSelfDisabled] = useState(false);

  // fetch player
  useEffect(() => {
    const getPlayer = async teamPlayerId => {
      const { data } = await tracker.get(`/games/teamPlayers/${teamPlayerId}`, {
        params: {
          token: getDigest("get", "/games/teamPlayers/:id"),
        },
      });
      const returnedTeamPlayer = await data;
      setPlayer(returnedTeamPlayer);
    };
    getPlayer(teamPlayerId);
  }, [teamPlayerId, scored]);

  // update team score
  useEffect(() => {
    if (!!player) {
      const { id, score } = player;
      setPlayerScores(ts => {
        return { ...ts, [id]: score };
      });
    }
  }, [player, setPlayerScores]);

  const handleClick = async event => {
    event.preventDefault();
    const alreadyDisabled = disabled;
    setSelfDisabled(true);
    await tracker.patch(
      "/goal",
      {
        teamPlayerId: teamPlayerId,
        newScore: player.score + 1,
      },
      {
        params: {
          token: getDigest("patch", "/goal"),
        },
      },
    );
    setScored(s => s + 1);
    setPlayerScores(ts => {
      return { ...ts, [player.id]: player.score + 1 };
    });
    setSelfDisabled(alreadyDisabled);
  };

  const ButtonContent = _props => {
    if (!!left) {
      return (
        <>
          <Label color={buttonColor} basic>
            {player.score}
          </Label>
          <Button color={buttonColor}>{player.name}</Button>
        </>
      );
    }
    return (
      <>
        <Button color={buttonColor}>{player.name}</Button>
        <Label color={buttonColor} basic>
          {player.score}
        </Label>
      </>
    );
  };

  if (!player) {
    return null;
  }

  return (
    <div className="score-buttons">
      <div className="position-title" style={{ color: textColor }}>
        {player.positionName}
      </div>
      <Button
        labelPosition={left ? "left" : "right"}
        onClick={handleClick}
        disabled={disabled || selfDisabled}
        as="div"
      >
        <ButtonContent />
      </Button>
    </div>
  );
};

const ScoreButtons = ({
  team,
  setPlayerScores,
  buttonColor,
  textColor,
  left,
  disabled,
}) => {
  return _.map(team.positions, position => {
    return (
      <ScoreButton
        teamPlayerId={position.player.teamPlayerId}
        left={left}
        buttonColor={buttonColor}
        textColor={textColor}
        disabled={disabled}
        setPlayerScores={setPlayerScores}
        key={position.player.teamPlayerId}
      />
    );
  });
};

export default ScoreButtons;
