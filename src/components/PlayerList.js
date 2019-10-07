import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import tracker from "../apis/tracker";
import { SportContext } from "../contexts/SportContext";
import { getDigest } from "../helpers/hmac";
import { icons } from "../img/icons";
import Footer from "./Footer";
import BackArrow from "./utility/BackArrow";

const SportSelectorList = () => {
  const { sports, selectedSport, setSelectedSport } = useContext(SportContext);
  if (!selectedSport) {
    return null;
  }

  return _.map(sports, sport => {
    const disabled = selectedSport.id === sport.id ? "" : "disabled";
    return (
      <div className="item" key={`${sport.name.toLowerCase()}-selector`}>
        <img
          className={`ui avatar image ${disabled}`}
          src={icons()[sport.name.toLowerCase()]}
          onClick={() => setSelectedSport(sport)}
          alt={`${sport.name}-selector`}
        ></img>
      </div>
    );
  });
};

const PlayerItems = () => {
  const { selectedSport } = useContext(SportContext);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPage(1);
    setHasMore(false);
    setPlayers([]);
  }, [selectedSport]);

  useEffect(() => {
    const getPlayers = async (sportId, currentPage, itemLimit = 10) => {
      const { data } = await tracker.get(`/players`, {
        params: {
          sort: ["elo", "name"],
          order: ["desc", "asc"],
          page: currentPage,
          limit: itemLimit,
          sportId,
          token: getDigest("get", "/players"),
        },
      });
      const returnedPlayers = await data;
      setPlayers(p => _.uniqBy(_.concat(p, returnedPlayers), "id"));
      setHasMore(returnedPlayers.length >= itemLimit);
    };
    if (selectedSport) {
      getPlayers(selectedSport.id, page, limit);
    }
  }, [limit, page, selectedSport]);

  const getNextPage = async page => {
    setPage(page);
    setHasMore(false);
  };

  if (_.isEmpty(players)) {
    return (
      <tbody>
        <tr>
          <td className="collapsing"></td>
          <td></td>
          <td className="collapsing"></td>
        </tr>
      </tbody>
    );
  }

  const items = _.map(players, (player, index) => {
    return (
      <tr key={`player-${player.id}-rank`}>
        <td className="collapsing">{index + 1}</td>
        <td>{player.name}</td>
        <td className="collapsing">{player.elo}</td>
      </tr>
    );
  });

  return (
    <InfiniteScroll
      element="tbody"
      pageStart={1}
      loadMore={page => getNextPage(page)}
      hasMore={hasMore}
      loader={
        <tr key={`loading`}>
          <td colSpan="3">Loading...</td>
        </tr>
      }
    >
      {items}
    </InfiniteScroll>
  );
};

const PlayerList = () => {
  return (
    <>
      <div className="ui center aligned header">
        <div className="ui huge horizontal list">
          <SportSelectorList />
        </div>
      </div>
      <div className="ui fluid icon input disabled">
        <input type="text" placeholder="Search..." />
        <i aria-hidden="true" className="search icon" />
      </div>
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
        <PlayerItems />
      </table>
      <BackArrow url="/" />
      <Footer />
    </>
  );
};

export default PlayerList;
