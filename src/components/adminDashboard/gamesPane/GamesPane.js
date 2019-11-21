import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Tab } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import Loading from "../../utility/Loading";
import TabControls from "../TabControls";
import GameModal from "./GameModal";
import GameRows from "./GameRows";
import { getGamesFromRecords } from "../../../helpers/games";
import Paginator from "../../utility/Paginator";

const fields = [
  { id: "id" },
  { sport: "sport" },
  { "Team 1": "team1" },
  { "Team 2": "team2" },
  { "elo awarded": "eloAwarded" },
  { "start time": "started" },
];

const GamesPane = _props => {
  const [sorted, setSorted] = useState({ column: "id", order: "asc" });
  const [sortedGames, setSortedGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [games, setGames] = useState([]);

  // update games
  useEffect(() => {
    const getGames = async () => {
      const { data } = await tracker.get("/games", {
        params: {
          token: getDigest("get", "/games"),
        },
      });
      const returnedGames = await data;
      setGames(getGamesFromRecords(returnedGames));
    };
    getGames();
  }, [showModal]);

  // set column sorts
  useEffect(() => {
    const { column, order } = sorted;
    if (!_.isEmpty(games)) {
      setSortedGames(_.orderBy(games, [column], [order]));
    }
  }, [sorted, games]);

  const handleClickHeader = event => {
    event.preventDefault();
    const field = _.find(fields, field => {
      return Object.keys(field)[0] === event.currentTarget.innerText.trim();
    });
    if (sorted.column === field) {
      if (sorted.order === "asc") {
        setSorted({ column: field, order: "desc" });
      } else {
        setSorted({ column: field, order: "asc" });
      }
    } else {
      setSorted({ column: field, order: "asc" });
    }
  };

  if (_.isEmpty(games)) {
    return <Loading />;
  }

  return (
    <Tab.Pane attached={false}>
      <TabControls
        modalProps={{
          onClickButton: setSelectedGame,
          showModal,
          setShowModal,
        }}
      />
      <Paginator
        columns={fields}
        items={sortedGames}
        ItemsComponent={GameRows}
        setShowModal={setShowModal}
        setSelected={setSelectedGame}
        tableId={"gamesTable"}
        sorted={sorted}
        handleClickHeader={handleClickHeader}
      />
      <GameModal
        game={selectedGame}
        showModal={showModal}
        setShowModal={setShowModal}
      ></GameModal>
    </Tab.Pane>
  );
};

export default GamesPane;
