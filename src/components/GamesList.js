import _ from "lodash-es";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { icons } from "../img/icons";
import { connect } from "react-redux";
import { getGamesByPage, getGameListData } from "../actions/gameListActions";
import BackArrow from "./utility/BackArrow";
import Footer from "./Footer";

class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
    };
  }

  componentDidMount() {
    this.props.getGameListData();
  }

  renderSearch = () => {
    return (
      <div className="ui fluid icon input disabled" key="gamesSearch">
        <input type="text" placeholder="Search..." />
        <i aria-hidden="true" className="search icon" />
      </div>
    );
  };

  renderTeam = (won, string) => {
    if (won) {
      return <b>{string}</b>;
    }
    return string;
  };

  renderTeams = (teams, winningScore, timestamp) => {
    return _.map(teams, (team, index) => {
      let positions = Object.keys(team);
      let teamScore = _.reduce(
        positions,
        (sum, p) => {
          return sum + team[p].score;
        },
        0,
      );
      return (
        <div className="item" key={`${timestamp}-${index}`}>
          {this.renderTeam(
            teamScore >= winningScore,
            `${team[positions[0]].name} & ${
              team[positions[1]].name
            }: ${teamScore}`,
          )}
        </div>
      );
    });
  };

  renderGames = () => {
    return _.map(this.props.games, game => {
      let winningScore = this.props.sports[game.sport].winningScore;
      return (
        <Link
          to={`/games/score/${game.id}`}
          className="item"
          key={`game-${game.id}`}
        >
          <div
            className="right floated content"
            style={{ paddingTop: ".75em", color: "#000000" }}
          >
            {new Date(game.started).toLocaleDateString("en-US")}
          </div>
          <img
            className="ui avatar image"
            src={icons()[this.props.sports[game.sport].name.toLowerCase()]}
            alt=""
          />
          <div className="content">
            <div className="ui list" style={{ padding: "0" }}>
              {this.renderTeams(game.teams, winningScore, game.started)}
            </div>
          </div>
        </Link>
      );
    });
  };

  renderGamesList = () => {
    if (Object.keys(this.props.sports).length < 1) {
      return null;
    }
    return (
      <InfiniteScroll
        className="ui very relaxed middle aligned striped divided list"
        key="games-list"
        pageStart={0}
        loadMore={this.props.getGamesByPage}
        hasMore={this.props.hasMore}
        loader={
          <div className="item" key="loader">
            <h4 className="ui center aligned header">Loading...</h4>
          </div>
        }
      >
        {this.renderGames()}
      </InfiniteScroll>
    );
  };

  render() {
    return [
      this.renderSearch(),
      this.renderGamesList(),
      <BackArrow url="/" key="back-arrow" />,
      <Footer key="footer" />,
    ];
  }
}

const mapStateToProps = ({ gameList, sports }) => {
  return {
    sports,
    games: gameList.games,
    hasMore: gameList.hasMore,
  };
};

export default connect(
  mapStateToProps,
  { getGamesByPage, getGameListData },
)(GamesList);
