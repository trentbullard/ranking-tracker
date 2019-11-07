import _ from "lodash";
import React, { useState, useEffect } from "react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { getGamesFromRecords } from "../../../helpers/games";
import { Tab, Input } from "semantic-ui-react";
import GameItems from "./GameItems";

const GamesPane = props => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [term, setTerm] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(true);

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

  // filter games
  useEffect(() => {
    if (_.isEmpty(term)) {
      setFilteredGames(games);
    } else {
      setFilteredGames(g => {
        return _.filter(games, value => {
          const started = new Date(
            Date.parse(value.started),
          ).toLocaleDateString("en-us");
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
    }
  }, [games, term]);

  // enable search
  useEffect(() => {
    if (!_.isEmpty(games)) {
      setSearchDisabled(false);
    } else {
      setSearchDisabled(true);
    }
  }, [games]);

  return (
    <>
      <Tab.Pane attached={false}>
        <Input
          placeholder="Search..."
          value={term}
          fluid
          icon="search"
          onChange={(_event, { value }) => setTerm(value)}
          disabled={searchDisabled}
        />
        <GameItems games={filteredGames} />
      </Tab.Pane>
    </>
  );
};

export default GamesPane;
