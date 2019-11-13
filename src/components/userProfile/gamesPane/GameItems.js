import _ from "lodash";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { icons } from "../../../img/icons";
import PlayerItems from "../../PlayerItems";
import { SportContext } from "../../../contexts/SportContext";
import { Dimmer, Loader } from "semantic-ui-react";
import "../../../styles/userProfile/gamesPane.css";

const GameItem = ({ game, sport }) => {
  if (!sport) {
    return null;
  }
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
};

const GameItems = props => {
  const { sports } = useContext(SportContext);

  if (_.isEmpty(props.games) || _.isEmpty(sports)) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  const items = _.map(props.games, game => {
    const sport = _.find(sports, { id: game.sport });
    return <GameItem game={game} sport={sport} key={`game-${game.id}`} />;
  });

  return (
    <div className="ui very relaxed middle aligned striped divided list">
      {items}
    </div>
  );
};

export default GameItems;
