import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTopPlayerData } from "../actions/topPlayerActions";

class PlayerList extends Component {
  componentDidMount() {
    this.props.getTopPlayerData();
  }

  getPlayers = () => {
    let ctr = 1;
    return _.map(this.props.players, player => {
      return (
        <tr key={`player-${player.id}-rank`}>
          <td className="collapsing">{ctr++}</td>
          <td>{player.name}</td>
          <td className="collapsing">{player.elo}</td>
        </tr>
      );
    });
  };

  getList = () => {
    if (this.props.players.length) {
      return (
        <table
          className="ui very basic unstackable celled striped table"
          key="player-rank-table"
        >
          <thead>
            <tr>
              <th key="rank">Rank</th>
              <th key="name">Name</th>
              <th key="elo">ELO</th>
            </tr>
          </thead>
          <tbody>{this.getPlayers()}</tbody>
        </table>
      );
    }
    return (
      <div className="ui center aligned header" key="no-players-error">
        No players added
      </div>
    );
  };

  renderSeeAllLink = () => {
    return (
      <div className="ui center aligned header" key="all-players-list">
        <Link to={"/players"}>all players</Link>
      </div>
    );
  };

  render() {
    return [
      <h2 className="ui center aligned header" key="top10Ranks">
        Top 10 Ranks
      </h2>,
      this.getList(),
      this.renderSeeAllLink(),
    ];
  }
}

const mapStateToProps = ({ topPlayers }) => {
  return {
    players: topPlayers,
  };
};

export default connect(
  mapStateToProps,
  { getTopPlayerData },
)(PlayerList);
