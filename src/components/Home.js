import React from "react";
import { Button } from "semantic-ui-react";
import history from "../history";
import SportList from "./SportList";
import TopPlayerList from "./TopPlayerList";
import LatestGamesList from "./LatestGamesList";
import Footer from "./Footer";
import "../styles/home.css";

const Home = props => {
  return (
    <>
      <h2 className="ui center aligned header home">Start a Game</h2>
      <h3 className="ui center aligned header home">Pick a Sport</h3>
      <SportList />
      <div className="ui divider home" />
      <div
        className="secondary menu item"
        onClick={() => {
          history.push("/players/new");
        }}
      >
        new player
        <Button circular icon="add user" className="blue add-player-btn" />
      </div>
      <TopPlayerList />
      <div className="ui divider home" />
      <LatestGamesList />
      <Footer />
    </>
  );
};

export default Home;
