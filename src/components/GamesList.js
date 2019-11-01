import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import tracker from "../apis/tracker";
import { SportContext } from "../contexts/SportContext";
import { getDigest } from "../helpers/hmac";
import { icons } from "../img/icons";
import "../styles/gamesList.css";
import Footer from "./Footer";
import BackArrow from "./utility/BackArrow";
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

const GameItems = ({ term }) => {
  const { sports } = useContext(SportContext);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  // fetch games
  useEffect(() => {
    const getGames = async (currentPage, itemLimit = 10) => {
      const { data } = await tracker.get(`/games`, {
        params: {
          sort: ["started"],
          order: ["desc"],
          page: currentPage,
          limit: itemLimit,
          token: getDigest("get", "/games"),
        },
      });
      const returnedGames = await data;
      setGames(g =>
        _.uniqBy(_.concat(g, getGamesFromRecords(returnedGames)), "id"),
      );
      setHasMore(returnedGames.length >= itemLimit);
    };
    getGames(page, limit);
  }, [limit, page]);

  // filter games
  useEffect(() => {
    if (_.isEmpty(term)) {
      setFilteredGames(games);
    }
    setFilteredGames(g => {
      return _.filter(games, value => {
        const started = new Date(Date.parse(value.started)).toLocaleDateString(
          "en-us",
        );
        if (started.includes(term)) {
          return true;
        }
        return _.map(value.teams, team => {
          return _.map(team.positions, position => {
            return position.player.name
              .toLowerCase()
              .includes(term.toLowerCase());
          }).some(v => {
            return !!v;
          });
        }).some(v => {
          return !!v;
        });
      });
    });
  }, [games, term]);

  const getNextPage = async page => {
    setPage(page);
    setHasMore(false);
  };

  if (_.isEmpty(games) || _.isEmpty(sports)) {
    return (
      <>
        <h4 className="ui center aligned header">No Games added</h4>
      </>
    );
  }

  const items = _.map(filteredGames, game => {
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
    <InfiniteScroll
      className="ui very relaxed middle aligned striped divided list"
      pageStart={1}
      loadMore={page => getNextPage(page)}
      hasMore={hasMore}
      loader={<div key="loading">Loading...</div>}
    >
      {items}
    </InfiniteScroll>
  );
};

const GamesList = props => {
  const [term, setTerm] = useState("");

  return (
    <>
      <Input
        placeholder="Search..."
        value={term}
        fluid
        icon="search"
        onChange={(_event, { value }) => setTerm(value)}
      />
      <GameItems term={term} />
      <BackArrow url="/" key="back-arrow" />
      <Footer key="footer" />
    </>
  );
};

export default GamesList;
