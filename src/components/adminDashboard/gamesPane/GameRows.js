import _ from "lodash";
import React, { useContext } from "react";
import { Table } from "semantic-ui-react";
import { SportContext } from "../../../contexts/SportContext";

const TeamCells = ({ teams, gameId }) => {
  return _.map(teams, team => {
    return (
      <Table.Cell key={`${gameId}-${team.name}`}>
        <div>{team.name}</div>
        {_.map(team.positions, position => {
          return (
            <div key={`${gameId}-${position.name}`}>
              {`${position.name} ${position.player.name}: ${position.player.score}`}
            </div>
          );
        })}
      </Table.Cell>
    );
  });
};

const GameRow = ({ game, setShowModal, setSelectedGame }) => {
  const { sports } = useContext(SportContext);
  const sport = _.find(sports, sport => sport.id === game.sport);

  const handleClickRow = event => {
    event.preventDefault();
    setSelectedGame(game);
    setShowModal(true);
  };

  return (
    <Table.Row onClick={handleClickRow}>
      <Table.Cell>{game.id}</Table.Cell>
      <Table.Cell>{sport.name}</Table.Cell>
      <TeamCells teams={game.teams} />
      <Table.Cell>{game.eloAwarded.toString()}</Table.Cell>
      <Table.Cell>{new Date(game.started).toLocaleString("en-us")}</Table.Cell>
    </Table.Row>
  );
};

const GameRows = ({ items, setSelected, setShowModal }) => {
  return _.map(items, game => {
    return (
      <GameRow
        game={game}
        setSelectedGame={setSelected}
        setShowModal={setShowModal}
        key={`game-${game.id}`}
      />
    );
  });
};

export default GameRows;
