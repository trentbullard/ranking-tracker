import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import { getPlayersByPage } from "../actions/playerListActions";
import BackArrow from "./utility/BackArrow";
import Footer from "./Footer";

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
    };
  }

  renderSearch = () => {
    return (
      <div className="ui fluid icon input disabled" key="gamesSearch">
        <input type="text" placeholder="Search..." />
        <i aria-hidden="true" className="search icon" />
      </div>
    );
  };

  renderPlayers = () => {
    var ctr = 1;
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

  renderList = () => {
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
        <InfiniteScroll
          element="tbody"
          pageStart={0}
          loadMore={this.props.getPlayersByPage}
          hasMore={this.props.hasMore}
          loader={
            <tr key={`loading`}>
              <td colSpan="3">Loading...</td>
            </tr>
          }
        >
          {this.renderPlayers()}
        </InfiniteScroll>
      </table>
    );
  };

  render() {
    return [
      this.renderSearch(),
      this.renderList(),
      <BackArrow url="/" key="back-arrow" />,
      <Footer key="footer" />,
    ];
  }
}

const mapStateToProps = ({ playerList }) => {
  return {
    players: playerList.players,
    hasMore: playerList.hasMore,
  };
};

export default connect(
  mapStateToProps,
  { getPlayersByPage },
)(PlayerList);
