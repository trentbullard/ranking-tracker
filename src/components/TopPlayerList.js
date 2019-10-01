import _ from "lodash-es";
import React, { useState, useEffect, useContext } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { Link } from "react-router-dom";
import { icons } from "../img/icons";
import { SportContext } from "../contexts/SportContext";

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

const PlayerList = () => {
  const [players, setPlayers] = useState([]);

  const { selectedSport } = useContext(SportContext);

  useEffect(() => {
    const getTopPlayers = async () => {
      const { data } = await tracker.get(`/players`, {
        params: {
          sort: ["elo", "name"],
          order: ["desc", "asc"],
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
      <tr key={`player-${player.id}-rank`}>
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
      <div className="ui center aligned header">
        <div className="ui huge horizontal list">
          <SportSelectorList />
        </div>
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
