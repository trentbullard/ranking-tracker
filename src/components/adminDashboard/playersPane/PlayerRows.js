import _ from "lodash";
import React, { useState } from "react";
import EditPlayerModal from "./EditPlayerModal";
import { Table } from "semantic-ui-react";

const PlayerRows = ({
  players,
  sorted: { column, order },
  setPlayerUpdated,
  setPlayerDeleted,
}) => {
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(null);
  const rows = _.map(_.orderBy(players, [column], [order]), (player, index) => {
    return (
      <Table.Row
        onClick={_event => setShowEditPlayerModal(player)}
        key={`player-row-${index}`}
        active={
          !!showEditPlayerModal &&
          _.isEqualWith(showEditPlayerModal, player, (selected, current) => {
            return selected.id === current.id;
          })
        }
      >
        <Table.Cell>{player.id}</Table.Cell>
        <Table.Cell>{player.name}</Table.Cell>
        <Table.Cell>{player.elo}</Table.Cell>
        <Table.Cell>{new Date(player.createdat).toLocaleString("en-US")}</Table.Cell>
      </Table.Row>
    );
  });
  return (
    <>
      {rows}
      <EditPlayerModal
        showModal={showEditPlayerModal}
        setShowModal={setShowEditPlayerModal}
        setPlayerUpdated={setPlayerUpdated}
        setPlayerDeleted={setPlayerDeleted}
      />
    </>
  );
};

export default PlayerRows;
