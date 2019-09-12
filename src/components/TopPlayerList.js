import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTopPlayerData } from "../actions/topPlayerActions";
import { icons } from "../img/icons";

class TopPlayerList extends Component {
  componentDidMount() {
    this.props.getTopPlayerData(this.props.selectedSportId);
  }

  handleClickSportSelector = sportId => {
    this.props.getTopPlayerData(sportId).then(() => {
      this.setState({ update: true });
    });
  };

  renderSportSelectorItems = selectedSport => {
    return _.map(this.props.sports, sport => {
      let disabled = selectedSport.id === sport.id ? "" : "disabled";
      return (
        <div className="item" key={`sport-selector-${sport.id}`}>
          <img
            className={`ui avatar image ${disabled}`}
            src={icons()[sport.name.toLowerCase()]}
            onClick={() => this.handleClickSportSelector(sport.id)}
            alt={`${sport.name}-selector`}
          ></img>
        </div>
      );
    });
  };

  renderSportSelectorList = () => {
    let selectedSport = this.props.sports[this.props.selectedSportId];
    if (!_.isUndefined(selectedSport)) {
      return (
        <div className="ui center aligned header" key="sport-selector-list">
          <div className="ui huge horizontal list">
            {this.renderSportSelectorItems(selectedSport)}
          </div>
        </div>
      );
    }
  };

  renderPlayerItems = () => {
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

  renderPlayerList = () => {
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
          <tbody>{this.renderPlayerItems()}</tbody>
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
      this.renderSportSelectorList(),
      this.renderPlayerList(),
      this.renderSeeAllLink(),
    ];
  }
}

const mapStateToProps = ({ topPlayers: { sport, players }, sports }) => {
  return {
    sports,
    selectedSportId: sport,
    players,
  };
};

export default connect(
  mapStateToProps,
  { getTopPlayerData },
)(TopPlayerList);
