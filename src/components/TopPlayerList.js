import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tracker from "../apis/tracker";
import { SportContext } from "../contexts/SportContext";
import { getDigest } from "../helpers/hmac";
import "../styles/topPlayerList.css";
import SportSelectorList from "./utility/SportSelectorList";
import history from "../history";

const PlayerList = () => {
  const [players, setPlayers] = useState([]);

  const { selectedSport } = useContext(SportContext);

  useEffect(() => {
    const getTopPlayers = async () => {
      const { data } = await tracker.get(`/players`, {
        params: {
          sort: ["elo", "name"],
          order: ["desc", "asc"],
          page: 1,
          limit: 10,
          sportId: selectedSport.id,
          token: getDigest("get", "/players"),
        },
      });
      const returnedPlayers = await data;
      setPlayers(returnedPlayers);
    };
    if (selectedSport) {
      getTopPlayers();
    }
  }, [selectedSport]);

  if (_.isEmpty(players)) {
    return null;
  }

  return _.map(players, (player, index) => {
    return (
      <tr
        key={`player-${player.id}-rank`}
        onClick={() => history.push(`/players/${player.id}`)}
      >
        <td className="collapsing">{index + 1}</td>
        <td>{player.name}</td>
        <td className="collapsing">{player.elo}</td>
      </tr>
    );
  });
};

const TopPlayerList = props => {
  return (
    <>
      <h2 className="ui center aligned header">Top 10 Ranks</h2>
      <SportSelectorList />
      <table className="ui very basic unstackable celled striped table unselectable">
        <thead>
          <tr>
            <th key="rank">Rank</th>
            <th key="name">Name</th>
            <th key="elo">ELO</th>
          </tr>
        </thead>
        <tbody>
          <PlayerList />
        </tbody>
      </table>
      <div className="ui center aligned header">
        <Link to={"/players"}>all players</Link>
      </div>
    </>
  );
};

export default TopPlayerList;
