import _ from "lodash";
import React, { useState, useContext, useEffect } from "react";
import tracker from "../../apis/tracker";
import { getDigest } from "../../helpers/hmac";
import { getGamesFromRecords } from "../../helpers/games";

const GamesPane = props => {
  const [games, setGames] = useState([]);

  // fetch games
  useEffect(() => {
    const getGames = async () => {
      const { data } = await tracker.get(`/games`, {
        params: {
          userId: props.userId,
          sort: ["started"],
          order: ["desc"],
          token: getDigest("get", "/games"),
        },
      });
      const returnedGames = await data;
      setGames(g => _.uniqBy(getGamesFromRecords(returnedGames), "id"));
    };
    getGames();
  }, [props.userId]);

  return <div>games pane</div>;
};

export default GamesPane;
