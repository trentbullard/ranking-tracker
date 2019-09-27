import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getTwoOnTwoFormData,
  createTwoOnTwoGame,
} from "../../actions/twoOnTwoAction";
import TwoOnTwoForm from "./TwoOnTwoForm";
import history from "../../history";
import { getTeamsFromForm } from "../../helpers/games";

class TwoOnTwoCreate extends Component {
  componentDidMount() {
    this.props.getTwoOnTwoFormData(this.props.sport.id);
  }

  onSubmit = ({ started, ...playerPositions }) => {
    const formattedValues = {
      sport: this.props.sport.id,
      eloAwarded: false,
      teams: getTeamsFromForm(playerPositions),
      started: new Date().toISOString(),
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
    ];
  }
}

const mapStateToProps = (
  { twoOnTwo: { players } },
  { location: { state } },
) => {
  let sport = state ? state.sport : {};
  return {
    players,
    sport,
  };
};

export default connect(
  mapStateToProps,
  { getTwoOnTwoFormData, createTwoOnTwoGame },
)(TwoOnTwoCreate);
