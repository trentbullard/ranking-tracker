import _ from "lodash";

const FOOSBALL = "Foosball";

// Foosball Win/Loss Keeper/Forward Goals/GoalsAgainst Weight
const FB_W_K_G_WT = "1.2";
const FB_W_K_GA_WT = "1.2";
const FB_W_F_G_WT = "1";
const FB_W_F_GA_WT = "1";
// const FB_L_K_G_WT = "1";
// const FB_L_K_GA_WT = "1";
// const FB_L_F_G_WT = "1";
// const FB_L_F_GA_WT = "1";

const CORNHOLE = "Cornhole";
const TABLE_TENNIS = "Table Tennis";

const K = {
  [FOOSBALL]: 30.0,
  [CORNHOLE]: 30.0,
  [TABLE_TENNIS]: 30.0,
};

const COEF = {
  [FOOSBALL]: 50.0,
  [CORNHOLE]: 40.0,
  [TABLE_TENNIS]: 40.0,
};

export const getNewElos = (wTeam, lTeam, sport) => {
  const wTeamScore = _.reduce(
    wTeam.positions,
    (acc, position) => {
      return acc + position.player.score;
    },
    0,
  );

  const wTeamElo =
    _.reduce(
      wTeam.positions,
      (acc, position) => {
        return acc + position.player.elo;
      },
      0,
    ) /
    (wTeam.positions.length * 1.0);

  const lTeamScore = _.reduce(
    lTeam.positions,
    (acc, position) => {
      return acc + position.player.score;
    },
    0,
  );

  const lTeamElo =
    _.reduce(
      lTeam.positions,
      (acc, position) => {
        return acc + position.player.elo;
      },
      0,
    ) /
    (lTeam.positions.length * 1.0);

  const wProb = probability(wTeamElo, lTeamElo, sport);
  const lProb = probability(lTeamElo, wTeamElo, sport);

  const wTeamDelta = K[sport.name] * (1 - wProb);
  const lTeamDelta = K[sport.name] * (0 - lProb);

  const wTeamUpdatedElos = _.map(wTeam.positions, position => {
    const positionName = position.name;
    const player = position.player;
    let newElo =
      player.elo +
      gainCalculation(wTeamDelta, positionName, player, lTeamScore, sport);
    return {
      elo: newElo,
      id: player.id,
    };
  });

  const lTeamUpdatedElos = _.map(lTeam.positions, position => {
    const positionName = position.name;
    const player = position.player;
    let newElo =
      player.elo +
      gainCalculation(lTeamDelta, positionName, player, wTeamScore, sport);
    return {
      elo: newElo,
      id: player.id,
    };
  });

  return _.concat(wTeamUpdatedElos, lTeamUpdatedElos);
};

const probability = (team1, team2, sport) => {
  const transformedTeam1Avg = 10.0 ** (team1 / COEF[sport.name]);
  const transformedTeam2Avg = 10.0 ** (team2 / COEF[sport.name]);
  return transformedTeam1Avg / (transformedTeam1Avg + transformedTeam2Avg);
};

const gainCalculation = (delta, position, player, goalsAgainst, sport) => {
  switch (sport.name) {
    case FOOSBALL:
      return foosballCalculation(delta, position, player, goalsAgainst);
    case CORNHOLE:
      return cornholeCalculation(delta);
    case TABLE_TENNIS:
      return tableTennisCalculation(delta);
    default:
      return 0;
  }
};

const foosballCalculation = (delta, position, player, goalsAgainst) => {
  let earned = delta / 2.0;
  const goals = player.score;
  if (delta > 0) {
    if (position === "Keeper") {
      earned =
        earned +
        earned * (0.0 - FB_W_K_GA_WT * (goalsAgainst / 40)) +
        earned * (FB_W_K_G_WT * (goals / 40));
    } else if (position === "Forward") {
      earned =
        earned +
        earned * (0.0 - FB_W_F_GA_WT * (goalsAgainst / 40)) +
        earned * (FB_W_F_G_WT * (goals / 40));
    }
  }
  return Math.round(earned);
};

const cornholeCalculation = delta => {
  let earned = delta / 2.0;
  return Math.round(earned);
};

const tableTennisCalculation = delta => {
  return Math.round(delta);
};
