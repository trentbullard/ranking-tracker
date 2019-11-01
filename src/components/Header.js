import React from "react";
import { Link } from "react-router-dom";
import UserButton from "./UserButton";

const Header = () => [
  <h1
    className="ui center aligned header"
    style={{ paddingTop: "3em" }}
    key="site-header"
  >
    <Link to="/">Rank Tracker</Link>
    <span className="ui green sub header">Season 1</span>
    <span className="ui red sub header">BETA</span>
  </h1>,
  <UserButton key="user-button" />,
];

export default Header;
