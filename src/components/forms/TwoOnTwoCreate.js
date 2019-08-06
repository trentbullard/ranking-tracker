import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getTwoOnTwoFormData,
  createTwoOnTwoGame,
} from "../../actions/twoOnTwoAction";
import TwoOnTwoForm from "./TwoOnTwoForm";
import Footer from "../Footer";
import history from "../../history";

class TwoOnTwoCreate extends Component {
  componentDidMount() {
    this.props.getTwoOnTwoFormData(this.props.sport.id);
  }

  onSubmit = ({ started, ...playerPositions }) => {
    let resetTeams = {};
    _.each(playerPositions, (playerId, positionPhrase) => {
      let [teamName, positionName] = positionPhrase.split(" ");
      resetTeams[teamName] = {
        ...resetTeams[teamName],
        [positionName]: { ...this.props.players[playerId], score: 0 },
      };
    });
    const formattedValues = {
      sport: this.props.sport.id,
      teams: resetTeams,
    };

    this.props.createTwoOnTwoGame(formattedValues);
  };

  onCancel = () => {
    history.push("/");
  };

  renderHeader = () => {
    if (this.props.sport.name) {
      return (
        <h3 className="ui center aligned header" key="2on2-form-header">
          Start a {this.props.sport.name} Game
        </h3>
      );
    }
  };

  render() {
    let players = _.orderBy(
      this.props.players,
      ["elo", "name"],
      ["desc", "asc"],
    );
    return [
      this.renderHeader(),
      <TwoOnTwoForm
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
        timestamp={new Date()}
        players={players}
        sport={this.props.sport}
        key="2on2-form"
      />,
      <Footer key="footer" />,
    ];
  }
}

const mapStateToProps = (
  { twoOnTwo },
  {
    location: {
      state: { sport },
    },
  },
) => {
  return {
    players: _.mapKeys(twoOnTwo.players, "id"),
    sport,
  };
};

export default connect(
  mapStateToProps,
  { getTwoOnTwoFormData, createTwoOnTwoGame },
)(TwoOnTwoCreate);
