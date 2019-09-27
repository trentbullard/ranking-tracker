import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import history from "../history";
import { getSports } from "../actions/index";
import SportList from "./SportList";
import TopPlayerList from "./TopPlayerList";
import LatestGamesList from "./LatestGamesList";
import Footer from "./Footer";

class Home extends Component {
  componentDidMount() {
    this.props.getSports();
  }

  handleClickNewPlayerButton = () => {
    history.push("/players/new");
  };

  renderSportList = () => {
    let sports = Object.values(this.props.sports);
    if (!_.isEmpty(sports)) {
      return <SportList sports={sports} key="sport-list" />;
    }
  };

  renderNewPlayerButton = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "76px",
          right: "15px",
          fontSize: "2em",
        }}
        onClick={this.handleClickNewPlayerButton}
        key="new-player-button"
      >
        <Button circular icon="add user" className="blue" />
      </div>
    );
  };

  render() {
    return [
      <h2
        className="ui center aligned header"
        style={{ marginTop: "2em" }}
        key="start-a-game"
      >
        Start a Game
      </h2>,
      <h3
        className="ui center aligned header"
        style={{ marginTop: "3em" }}
        key="pick-a-sport"
      >
        Pick a Sport
      </h3>,
      this.renderSportList(),
      <div
        className="ui divider"
        style={{ margin: "2em 0" }}
        key="divider-1"
      />,
      this.renderNewPlayerButton(),
      <TopPlayerList key="top-player-list" />,
      <div
        className="ui divider"
        style={{ margin: "2em 0" }}
        key="divider-2"
      />,
      <LatestGamesList key="latest-games-list" />,
      <Footer key="footer" />,
    ];
  }
}

const mapStateToProps = ({ sports }) => {
  return { sports };
};

export default connect(
  mapStateToProps,
  { getSports },
)(Home);
