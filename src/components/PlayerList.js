import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import history from "../history";
import {
  getPlayersByPage,
  getSports,
  selectSport,
} from "../actions/playerListActions";
import BackArrow from "./utility/BackArrow";
import Footer from "./Footer";
import { icons } from "../img/icons";

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      ready: false,
    };
  }

  componentDidMount() {
    this.props.getSports().then(() => {
      if (!_.isEmpty(this.props.location.hash)) {
        let hashSport = _.find(Object.values(this.props.sports), value => {
          return (
            `#${value.name.toLowerCase()}` ===
            this.props.location.hash.toLowerCase()
          );
        });
        if (hashSport.id) {
          this.props.selectSport(hashSport.id);
        }
      }
      this.setState({ ready: true });
    });
  }

  handleClickSportSelector = sportId => {
    this.props.selectSport(sportId).then(() => {
      let sportName = this.props.sports[sportId].name.toLowerCase();
      history.push(`/players#${sportName}`);
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
    if (!this.state.ready) {
      return null;
    }

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
      this.renderSportSelectorList(),
      this.renderSearch(),
      this.renderList(),
      <BackArrow url="/" key="back-arrow" />,
      <Footer key="footer" />,
    ];
  }
}

const mapStateToProps = (
  { playerList: { sports, selectedSportId, players, hasMore } },
  { location: hash },
) => {
  return {
    hash,
    sports,
    selectedSportId,
    players,
    hasMore,
  };
};

export default connect(
  mapStateToProps,
  { getPlayersByPage, getSports, selectSport },
)(PlayerList);
