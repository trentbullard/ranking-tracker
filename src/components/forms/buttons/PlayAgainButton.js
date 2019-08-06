import React from "react";

const PlayAgainButton = props => (
  <div className="ui center aligned header" key="play-again-button">
    <div className="ui positive button" onClick={props.onClick}>
      Play Again
    </div>
  </div>
);

export default PlayAgainButton;
