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
  const wTeamName = wTeam.name;
  const lTeamName = lTeam.name;
  const position1 = wTeam.positions[0].name;
  const position2 = wTeam.positions[1].name;
  const wPlayer1 = wTeam.positions[0].player;
  const wPlayer2 = wTeam.positions[1].player;
  const lPlayer1 = lTeam.positions[0].player;
  const lPlayer2 = lTeam.positions[1].player;
  const wTeamGoals = wPlayer1.score + wPlayer2.score;
  const lTeamGoals = lPlayer1.score + lPlayer2.score;
  const wTeamAvgElo = (wPlayer1.elo + wPlayer2.elo) / 2.0;
  const lTeamAvgElo = (lPlayer1.elo + lPlayer2.elo) / 2.0;
  const wProb = probability(wTeamAvgElo, lTeamAvgElo);
  const lProb = probability(lTeamAvgElo, wTeamAvgElo);
  const wTeamDelta = K * (1 - wProb);
  const lTeamDelta = K * (0 - lProb);
  const wPlayer1Gain = gainCalculation(
    wTeamDelta,
    position1,
    wPlayer1,
    lTeamGoals,
    sport,
  );
  const wPlayer2Gain = gainCalculation(
    wTeamDelta,
    position2,
    wPlayer2,
    lTeamGoals,
    sport,
  );
  const lPlayer1Gain = gainCalculation(
    lTeamDelta,
    position1,
    lPlayer1,
    wTeamGoals,
    sport,
  );
  const lPlayer2Gain = gainCalculation(
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

const probability = (team1, team2) => {
  const transformedTeam1Avg = 10.0 ** (team1 / 40.0);
  const transformedTeam2Avg = 10.0 ** (team2 / 40.0);
  return transformedTeam1Avg / (transformedTeam1Avg + transformedTeam2Avg);
};

const gainCalculation = (delta, position, player, goalsAgainst, sport) => {
  switch (sport.name) {
    case FOOSBALL:
      return foosballCalculation(delta, position, player, goalsAgainst);
    case CORNHOLE:
      return cornholeCalculation(delta, player);
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

const cornholeCalculation = (delta, player) => {
  let earned = delta / 2.0;
  return Math.round(earned);
};
