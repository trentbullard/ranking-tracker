import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { icons } from "../img/icons";
import { getLatestGameData } from "../actions/latestGamesActions";

class GameList extends Component {
  componentDidMount() {
    this.props.getLatestGameData();
  }

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

  renderList = () => {
    if (
      this.props.games.length &&
      Object.keys(this.props.sports).length
    ) {
      return (
        <div
          className="ui very relaxed middle aligned striped divided list"
          key="game-list"
        >
          {this.renderGames()}
        </div>
      );
    }
    return (
      <div className="ui center aligned header" key="no-games-error">
        No Games added. Click a sport above to start.
      </div>
    );
  };

  renderSeeAllLink = () => {
    return (
      <div className="ui center aligned header" key="all-games-list">
        <Link to={"/games"}>all games</Link>
      </div>
    );
  };

  render() {
    return [
      <h2 className="ui center aligned header" key="startAGame">
        Latest Games
      </h2>,
      this.renderList(),
      this.renderSeeAllLink(),
    ];
  }
}

const mapStateToProps = ({ latestGames, sports }) => {
  return {
    games: latestGames,
    sports,
  };
};

export default connect(
  mapStateToProps,
  { getLatestGameData },
)(GameList);
