import React from "react";

export default ({
  match: {
    params: { id },
  },
}) => {
  return <h1 className="ui center aligned header">User {id}</h1>;
};
