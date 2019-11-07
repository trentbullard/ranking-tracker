import _ from "lodash";
import React from "react";
import { Table } from "semantic-ui-react";

const SportRow = ({ sport, setShowModal, setSelectedSport }) => {
  const handleClickRow = event => {
    event.preventDefault();
    setSelectedSport(sport);
    setShowModal(true);
  };

  return (
    <Table.Row onClick={handleClickRow}>
      <Table.Cell>{sport.id}</Table.Cell>
      <Table.Cell>{sport.name}</Table.Cell>
      <Table.Cell>{sport.winningScore}</Table.Cell>
      <Table.Cell>{sport.teamNames.split(",").join(", ")}</Table.Cell>
      <Table.Cell>{sport.positionNames.split(",").join(", ")}</Table.Cell>
      <Table.Cell>{sport.enabled.toString()}</Table.Cell>
      <Table.Cell>{sport.playersPerTeam}</Table.Cell>
      <Table.Cell>{sport.iconName}</Table.Cell>
    </Table.Row>
  );
};

const SportRows = ({ sports, setSelectedSport, setShowModal }) => {
  return _.map(sports, sport => {
    return (
      <SportRow
        sport={sport}
        setSelectedSport={setSelectedSport}
        setShowModal={setShowModal}
        key={`sport-${sport.id}`}
      />
    );
  });
};

export default SportRows;
