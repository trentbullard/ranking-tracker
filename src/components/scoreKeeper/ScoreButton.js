import React from "react";
import { Button, Label } from "semantic-ui-react";

const ScoreButton = ({ buttonColor, player, left, disabled }) => {
  const handleClick = event => {
    event.preventDefault();
    console.log(`${player.name} clicked: ${player.score}`);
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
      <Button
        labelPosition={left ? "left" : "right"}
        onClick={handleClick}
        disabled={disabled}
        as="div"
      >
        <ButtonContent />
      </Button>
    </div>
  );
};

export default ScoreButton;
