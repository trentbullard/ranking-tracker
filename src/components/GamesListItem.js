import _ from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import { icons } from "../img/icons";

const renderTeam = (won, phrase) => {
  if (won) {
    return <b>{phrase}</b>;
  }
  return phrase;
};

const renderTeams = (teams, winningScore, started) =>
  _.map(teams, (team, index) => {
    let positions = team.positions;
    let teamScore = _.reduce(
      positions,
      (sum, p) => {
        return sum + p.player.score;
      },
      0,
    );
    return (
      <div className="item" key={`${started}-${index}`}>
        {renderTeam(
          teamScore >= winningScore,
          `${team.positions[0].player.name} & ${team.positions[1].player.name}: ${teamScore}`,
        )}
      </div>
    );
  });

const GamesListItem = ({ game, sport }) => (
  <Link to={`/games/score/${game.id}`} className="item">
    <div
      className="right floated content"
      style={{ paddingTop: ".75em", color: "#000000" }}
    >
      {new Date(game.started).toLocaleDateString("en-US")}
    </div>
    <img
      className="ui avatar image"
      src={icons()[sport.name.toLowerCase()]}
      alt=""
    />
    <div className="content">
      <div className="ui list" style={{ padding: "0" }}>
        {renderTeams(game.teams, sport.winningScore, game.started)}
      </div>
    </div>
  </Link>
);

export default GamesListItem;
