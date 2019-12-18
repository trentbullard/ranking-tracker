import React from "react";
import history from "../../history";

const BackArrow = _props => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "15px",
        fontSize: "2em",
      }}
      onClick={() => history.goBack()}
    >
      <i className="arrow left blue icon" />
    </div>
  );
};

export default BackArrow;
