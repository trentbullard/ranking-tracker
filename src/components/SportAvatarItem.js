import React from "react";
import { Link } from "react-router-dom";
import { icons } from "../img/icons";

const SportAvatarItem = ({ sport }) => (
  <Link
    className="item"
    to={{
      pathname: `/${sport.name.toLowerCase()}/new`,
      state: { sport },
    }}
  >
    <img
      className="ui avatar image"
      alt={`${sport.name.toLowerCase()} icon`}
      src={icons()[sport.name.toLowerCase()]}
      style={{ fontSize: "1.5em" }}
    />
    <div className="header">{sport.name}</div>
  </Link>
);

export default SportAvatarItem;
