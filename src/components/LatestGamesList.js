import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { icons } from "../img/icons";
import { SportContext } from "../contexts/SportContext";
import "../styles/gamesList.css";
import { getGamesFromRecords } from "../helpers/games";

const PlayerItems = ({ teams, winningScore, gameId }) => {
  return _.map(teams, (team, index) => {
    const positions = team.positions;
    const teamScore = _.reduce(
      positions,
      (sum, p) => {
        return sum + p.player.score;
      },
      0,
    );
    const teamString = `${positions[0].player.name} & ${positions[1].player.name}: ${teamScore}`;
    const teamElement =
      teamScore >= winningScore ? <b>{teamString}</b> : teamString;
    return (
      <div className="item" key={`${gameId}-${index}`}>
        {teamElement}
      </div>
    );
  });
};

const GameItems = () => {
  const [games, setGames] = useState([]);
  const { sports } = useContext(SportContext);

  useEffect(() => {
    const getLatestGames = async () => {
      const { data } = await tracker.get(`/games`, {
        params: {
          sort: ["started"],
          order: ["desc"],
          limit: 10,
          token: getDigest("get", "/games"),
        },
      });
      const returnedGames = await data;
      setGames(getGamesFromRecords(returnedGames));
    };
    getLatestGames();
  }, []);

  if (_.isEmpty(games) || _.isEmpty(sports)) {
    return (
      <>
        <h4 className="ui center aligned header">
          No Games added
          <br />
          Start a new game by picking a sport above
        </h4>
      </>
    );
  }

  const items = _.map(games, game => {
    const sport = _.find(sports, { id: game.sport });
    let winningScore = sport.winningScore;
    return (
      <Link
        to={`/games/score/${game.id}`}
        className="item"
        key={`game-${game.id}`}
      >
        <div className="right floated content game-date">
          {new Date(game.started).toLocaleDateString("en-US")}
        </div>
        <img
          className="ui avatar image"
          src={icons()[sport.name.toLowerCase()]}
          alt=""
        />
        <div className="content">
          <div className="ui list" style={{ padding: "0" }}>
            <PlayerItems
              teams={game.teams}
              winningScore={winningScore}
              gameId={game.id}
            />
          </div>
        </div>
      </Link>
    );
  });

  return (
    <div className="ui very relaxed middle aligned striped divided list">
      {items}
    </div>
  );
};

const LatestGamesList = () => {
  return (
    <>
      <h2 className="ui center aligned header">Latest Games</h2>
      <GameItems />
      <div className="ui center aligned header">
        <Link to={"/games"}>all games</Link>
      </div>
    </>
  );
};

export default LatestGamesList;
