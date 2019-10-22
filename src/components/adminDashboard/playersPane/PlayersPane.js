import _ from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tab, Table, Button } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { FlashContext } from "../../../contexts/FlashContext";
import { getDigest } from "../../../helpers/hmac";
import "../../../styles/adminDashboard/usersPane/usersPane.css";
import NewPlayerModal from "./NewPlayerModal";
import PlayerRows from "./PlayerRows";

const fieldMap = {
  id: "id",
  name: "name",
  "created at": "createdat",
  elo: "elo",
};

const PlayersPane = props => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [term, setTerm] = useState("");
  const [sorted, setSorted] = useState({ column: "id", order: "asc" });
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);
  const [playerAdded, setPlayerAdded] = useState(null);
  const [playerUpdated, setPlayerUpdated] = useState(null);
  const [playerDeleted, setPlayerDeleted] = useState(null);

  const { addFlash } = useContext(FlashContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedAddFlash = useCallback(message => addFlash(message), [
    playerAdded,
  ]);

  // getPlayers
  useEffect(() => {
    const getPlayers = async () => {
      const { data } = await tracker.get("/players", {
        params: {
          token: getDigest("get", "/players"),
        },
      });
      const returnedPlayers = await data;
      setPlayers(returnedPlayers);
      setFilteredPlayers(returnedPlayers);
    };
    getPlayers();
  }, [playerAdded, playerUpdated, playerDeleted]);

  // filtering
  useEffect(() => {
    setFilteredPlayers(
      _.filter(players, player => {
        return (
          player.id.toString().includes(term) ||
          player.name.includes(term) ||
          player.elo.toString().includes(term) ||
          new Date(player.createdat).toLocaleString("en-US").includes(term)
        );
      }),
    );
  }, [term, players]);

  // sorting
  useEffect(() => {
    const { column, order } = sorted;
    setFilteredPlayers(fp => _.orderBy(fp, [column], [order]));
  }, [sorted]);

  // addFlash on player create
  useEffect(() => {
    if (!!playerAdded) {
      const { name } = playerAdded;
      memoizedAddFlash(`player created successfully: ${name}`);
    }
  }, [memoizedAddFlash, playerAdded]);

  const handleSearch = event => {
    event.preventDefault();
    setTerm(event.currentTarget.value);
  };

  const handleClickHeader = event => {
    event.preventDefault();
    const field = fieldMap[event.currentTarget.innerText];
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

  return (
    <Tab.Pane attached={false}>
      <div className="flex-container">
        <div className="tab pane menu button">
          <NewPlayerModal
            userAdded={setPlayerAdded}
            showModal={showNewPlayerModal}
            setShowModal={setShowNewPlayerModal}
          >
            <Button
              className="green"
              circular
              icon="add"
              onClick={_event => setShowNewPlayerModal(true)}
            />
          </NewPlayerModal>
        </div>
        <div className="tab pane menu divider" />
        <div className="tab pane menu search">
          <div className="ui fluid icon input">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
            />
            <i aria-hidden="true" className="search icon" />
          </div>
        </div>
      </div>
      <Table unstackable celled striped id="playersTable">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              id
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              name
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              elo
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              created at
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <PlayerRows
            players={filteredPlayers}
            sorted={sorted}
            setPlayerUpdated={setPlayerUpdated}
            setPlayerDeleted={setPlayerDeleted}
          />
        </Table.Body>
      </Table>
    </Tab.Pane>
  );
};

export default PlayersPane;
