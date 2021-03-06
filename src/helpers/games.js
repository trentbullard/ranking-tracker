import _ from "lodash";

export const getGamesFromRecords = records => {
  let gameOrder = _.reduce(
    _.map(records, "gameId"),
    (acc, value) => {
      return _.union(acc, [value]);
    },
    [],
  );
  let games = [];
  let gameGroups = Object.values(_.groupBy(records, "gameId"));
  _.each(gameGroups, gameGroup => {
    let game = { teams: [] };
    let teamGroups = Object.values(_.groupBy(gameGroup, "teamName"));
    _.each(teamGroups, teamGroup => {
      let team = { positions: [] };
      _.each(teamGroup, record => {
        let position = {
          name: record.position,
          player: {
            name: record.playerName,
            elo: record.playerElo,
            id: record.playerId,
            score: record.score,
            teamPlayerId: record.teamPlayerId,
          },
        };
        team = {
          ...team,
          name: record.teamName,
          id: record.teamId,
        };
        team.positions.push(position);
        game = {
          ...game,
          id: record.gameId,
          eloAwarded: record.eloAwarded,
          sport: record.sportId,
          started: record.started,
        };
      });
      game.teams.push(team);
    });
    games.push(game);
  });
  games = _.map(gameOrder, id => {
    return _.find(games, { id });
  });
  return games;
};
