import React from "react";
import { Link } from "react-router-dom";
import { icons } from "../img/icons";

const SportAvatarItem = props => (
  <Link
    className="item"
    to={{
      pathname: `/${props.sport.name.toLowerCase()}/new`,
      state: { sport: props.sport },
    }}
  >
    <img
      className="ui avatar image"
      alt={`${props.sport.name.toLowerCase()} icon`}
      src={icons()[props.sport.name.toLowerCase()]}
      style={{ fontSize: "1.5em" }}
    />
    <div className="header">{props.sport.name}</div>
  </Link>
);

export default SportAvatarItem;
