import React from "react";
import { AppContext } from "../contexts/AppContext";

export default ({
  match: {
    params: { id },
  },
}) => {
  return (
    <AppContext.Consumer>
      {context => {
        return <h1 className="ui center aligned header">User {id}</h1>;
      }}
    </AppContext.Consumer>
  );
};
