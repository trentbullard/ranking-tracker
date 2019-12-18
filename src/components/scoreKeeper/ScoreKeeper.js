import _ from "lodash";
import React, { useContext, useEffect } from "react";
import ScoreProvider, { ScoreContext } from "../../contexts/ScoreContext";
import BackArrow from "../utility/BackArrow";
import SportProvider, { SportContext } from "../../contexts/SportContext";
import Loading from "../utility/Loading";
import "../../styles/scoreKeeper/scoreKeeper.css";
import TeamColumns from "./TeamColumns";
import PlayAgainButton from "./PlayAgainButton";

const ScoreKeeper = props => {
  const { game, setGameId, setSport, sport, setLoading } = useContext(
    ScoreContext,
  );
  const { sports } = useContext(SportContext);

  // set gameId
  useEffect(() => {
    const { id } = props.match.params;
    setLoading(true);
    setGameId(id);
  }, [props.match.params, setGameId, setLoading]);

  // set sport from game
  useEffect(() => {
    if (!!game) {
      const { sportId } = game;
      const currentSport = _.find(sports, { id: sportId });
      if (!_.isEmpty(currentSport)) {
        setSport(currentSport);
      }
    }
  }, [game, sports, setSport]);

  if (!sport) {
    return <Loading caption dim />;
  }

  return (
    <>
      <h3
        className="ui center aligned header"
        style={{ margin: "2em" }}
        key="scorekeeper-header"
      >
        Score Keeper {sport.name}
      </h3>
      <div className="team-grid">
        <TeamColumns />
      </div>
      <PlayAgainButton />
      <BackArrow />
    </>
  );
};

const ScoreKeeperProvider = props => {
  return (
    <SportProvider>
      <ScoreProvider>
        <ScoreKeeper {...props} />
      </ScoreProvider>
    </SportProvider>
  );
};

export default ScoreKeeperProvider;
