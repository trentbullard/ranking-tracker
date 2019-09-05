const K = 30;
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

export const getNewElos = (wTeam, lTeam, sport) => {
  let wTeamName = wTeam.name;
  let lTeamName = lTeam.name;
  let position1 = wTeam.positions[0].name;
  let position2 = wTeam.positions[1].name;
  let wPlayer1 = wTeam.positions[0].player;
  let wPlayer2 = wTeam.positions[1].player;
  let lPlayer1 = lTeam.positions[0].player;
  let lPlayer2 = lTeam.positions[1].player;
  let wTeamGoals = wPlayer1.score + wPlayer2.score;
  let lTeamGoals = lPlayer1.score + lPlayer2.score;
  let wTeamAvgElo = (wPlayer1.elo + wPlayer2.elo) / 2.0;
  let lTeamAvgElo = (lPlayer1.elo + lPlayer2.elo) / 2.0;
  let wProb = probability(wTeamAvgElo, lTeamAvgElo);
  let lProb = probability(lTeamAvgElo, wTeamAvgElo);
  let wTeamDelta = K * (1 - wProb);
  let lTeamDelta = K * (0 - lProb);
  let wPlayer1Gain = gainCalculation(
    wTeamDelta,
    position1,
    wPlayer1,
    lTeamGoals,
    sport,
  );
  let wPlayer2Gain = gainCalculation(
    wTeamDelta,
    position2,
    wPlayer2,
    lTeamGoals,
    sport,
  );
  let lPlayer1Gain = gainCalculation(
    lTeamDelta,
    position1,
    lPlayer1,
    wTeamGoals,
    sport,
  );
  let lPlayer2Gain = gainCalculation(
    lTeamDelta,
    position2,
    lPlayer2,
    wTeamGoals,
    sport,
  );

  return [
    {
      ...wPlayer1,
      elo: wPlayer1.elo + wPlayer1Gain <= 0 ? 0 : wPlayer1.elo + wPlayer1Gain,
      teamName: wTeamName,
      position: position1,
    },
    {
      ...wPlayer2,
      elo: wPlayer2.elo + wPlayer2Gain <= 0 ? 0 : wPlayer2.elo + wPlayer2Gain,
      teamName: wTeamName,
      position: position2,
    },
    {
      ...lPlayer1,
      elo: lPlayer1.elo + lPlayer1Gain <= 0 ? 0 : lPlayer1.elo + lPlayer1Gain,
      teamName: lTeamName,
      position: position1,
    },
    {
      ...lPlayer2,
      elo: lPlayer2.elo + lPlayer2Gain <= 0 ? 0 : lPlayer2.elo + lPlayer2Gain,
      teamName: lTeamName,
      position: position2,
    },
  ];
};

const probability = (winner, loser) => {
  return 1.0 / (1.0 + Math.pow(10, (winner - loser) / 400));
};

const gainCalculation = (delta, position, player, goalsAgainst, sport) => {
  switch (sport.name) {
    case FOOSBALL:
      return foosballCalulation(delta, position, player, goalsAgainst);
    case CORNHOLE:
      return cornholeCalulation(delta, player);
    default:
      return 0;
  }
};

const foosballCalulation = (delta, position, player, goalsAgainst) => {
  let earned = delta / 2.0;
  let goals = player.score;
  if (delta > 0) {
    if (position === "Keeper") {
      earned =
        earned +
        earned * (0.0 - FB_W_K_GA_WT * (goalsAgainst / 20)) +
        earned * (FB_W_K_G_WT * (goals / 20));
    } else if (position === "Forward") {
      earned =
        earned +
        earned * (0.0 - FB_W_F_GA_WT * (goalsAgainst / 20)) +
        earned * (FB_W_F_G_WT * (goals / 20));
    }
  } else if (delta < 0) {
    if (position === "Keeper") {
    } else if (position === "Forward") {
    }
  }
  return Math.round(earned);
};

const cornholeCalulation = (delta, player) => {
  let earned = delta / 2.0;
  let goals = player.score;
  earned = earned * (goals / 21.0);
  return Math.round(earned);
};
