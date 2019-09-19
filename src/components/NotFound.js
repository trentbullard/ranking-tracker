import React from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

export default props => {
  return (
    <AppContext.Consumer>
      {context => {
        context.badRoute();
        return <Redirect to="/" />;
      }}
    </AppContext.Consumer>
  );
};
