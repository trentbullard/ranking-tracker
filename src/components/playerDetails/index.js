import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import tracker from "../../apis/tracker";
import { getDigest } from "../../helpers/hmac";
import { getGamesFromRecords } from "../../helpers/games";
import BackArrow from "../utility/BackArrow";
import GameHistory from "./GameHistory";
import { SportContext } from "../../contexts/SportContext";
import SportSelectorList from "../utility/SportSelectorList";
import Footer from "../Footer";

const PlayerDetails = ({ match: { params: {id} } }) => {
  const { selectedSport } = useContext(SportContext);
  const [playerId, setPlayerId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [games, setGames] = useState([]);

  // set playerId
  useEffect(() => {
    setPlayerId(id);
  }, [id, setPlayerId]);

  // get player
  useEffect(() => {
    const getPlayer = async id => {
      const { data } = await tracker.get(`/players/${id}`, {
        params: {
          sportId: 1,
          token: getDigest("get", "/players/:id"),
        },
      });
      const returnedPlayer = await data;
      setPlayer(returnedPlayer);
    };

    if (playerId) {
      getPlayer(playerId);
    }
  }, [playerId]);

  // get games for player
  useEffect(() => {
    const getGames = async id => {
      const { data } = await tracker.get(`/games`, {
        params: {
          where: {
            "p.id": id,
          },
          token: getDigest("get", "/games"),
        },
      });
      const returnedGames = await data;
      setGames(getGamesFromRecords(returnedGames));
    };

    if (playerId) {
      getGames(playerId);
    }
  }, [playerId]);

  return (
    <>
      <SportSelectorList />
      <h1 className="ui header">{player ? player.name : ""}</h1>
      <div className="ui divider" />
      <GameHistory games={games} />
      <BackArrow />
      <Footer />
    </>
  );
};

export default PlayerDetails;
