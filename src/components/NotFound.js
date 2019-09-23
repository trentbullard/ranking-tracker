import React from "react";
import { Redirect } from "react-router-dom";
import { FlashContext } from "../contexts/FlashContext";

export default props => {
  return (
    <FlashContext.Consumer>
      {context => {
        context.addFlash("oops, that page doesn't exist");
        return <Redirect to="/" />;
      }}
    </FlashContext.Consumer>
  );
};
