import React from "react";
import history from "../../history";

const handleClick = url => {
  history.push(url);
};

const BackArrow = ({ url }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "15px",
        fontSize: "2em",
      }}
      onClick={() => handleClick(url)}
    >
      <i className="arrow left blue icon" />
    </div>
  );
};

export default BackArrow;
