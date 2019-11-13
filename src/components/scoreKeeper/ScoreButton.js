import React, { useState, useContext } from "react";
import { Button, Label } from "semantic-ui-react";
import { ScoreContext } from "../../contexts/ScoreContext";
import { getDigest } from "../../helpers/hmac";
import tracker from "../../apis/tracker";

const ScoreButton = ({
  buttonColor,
  textColor,
  player,
  positionName,
  left,
  disabled,
}) => {
  const { setScored } = useContext(ScoreContext);
  const [selfDisabled, setSelfDisabled] = useState(false);

  const handleClick = async event => {
    event.preventDefault();
    const alreadyDisabled = disabled;
    setSelfDisabled(true);
    await tracker.patch(
      "/goal",
      {
        teamPlayerId: player.teamPlayerId,
        newScore: player.score + 1,
      },
      {
        params: {
          token: getDigest("patch", "/goal"),
        },
      },
    );
    setScored(s => s + 1);
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

  return (
    <div className="score-buttons">
      <div className="position-title" style={{ color: textColor }}>
        {positionName}
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

export default ScoreButton;
