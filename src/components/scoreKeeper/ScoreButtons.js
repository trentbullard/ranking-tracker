import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Button, Label } from "semantic-ui-react";
import { getDigest } from "../../helpers/hmac";
import tracker from "../../apis/tracker";
import Loading from "../utility/Loading";
import { ScoreContext } from "../../contexts/ScoreContext";

const ScoreButton = ({
  currentTeamName,
  teamPlayer,
  left,
  buttonColor,
  textColor,
  disabled,
  setPlayerScores,
  setScored,
}) => {
  const { setTeams, setLoading, setPlayersLoaded, sport } = useContext(
    ScoreContext,
  );
  const [player, setPlayer] = useState(null);

  // fetch player
  useEffect(() => {
    const getPlayer = async (id, sport) => {
      const { id: sportId } = sport;
      const { data } = await tracker.get(`/players/${id}`, {
        params: {
          sportId,
          token: getDigest("get", "/players/:id"),
        },
      });
      const returnedPlayer = await data;
      setPlayer(returnedPlayer);
    };
    if (!!teamPlayer && !!sport) {
      const { playerId } = teamPlayer;
      getPlayer(playerId, sport);
    }
  }, [teamPlayer, sport]);

  // set team for play again
  useEffect(() => {
    if (!!player) {
      const { position: positionName } = teamPlayer;
      setTeams(teams => {
        const teamsClone = _.cloneDeep(teams);
        _.each(teamsClone, (team, teamIndex) => {
          if (team.name === currentTeamName) {
            _.each(team.positions, (position, positionIndex) => {
              if (position.name === positionName) {
                _.set(
                  teamsClone,
                  `[${teamIndex}].positions[${positionIndex}].player`,
                  player,
                );
                _.set(
                  teamsClone,
                  `[${teamIndex}].positions[${positionIndex}].player.score`,
                  teamPlayer.score,
                );
              }
            });
          }
        });
        return teamsClone;
      });
      setPlayersLoaded(count => count + 1);
    }
  }, [player, teamPlayer, setTeams, currentTeamName, setPlayersLoaded]);

  // update team score
  useEffect(() => {
    if (!!teamPlayer) {
      const { id, score } = teamPlayer;
      setPlayerScores(ts => {
        return { ...ts, [id]: score };
      });
    }
  }, [teamPlayer, setPlayerScores]);

  const handleClick = async event => {
    event.preventDefault();
    setLoading(true);
    await tracker.patch(
      "/goal",
      {
        teamPlayerId: teamPlayer.id,
        newScore: teamPlayer.score + 1,
      },
      {
        params: {
          token: getDigest("patch", "/goal"),
        },
      },
    );
    setScored(s => s + 1);
    setLoading(false);
  };

  const ButtonContent = _props => {
    if (!!left) {
      return (
        <>
          <Label color={buttonColor.toLowerCase()} basic>
            {teamPlayer.score}
          </Label>
          <Button color={buttonColor.toLowerCase()}>{player.name}</Button>
        </>
      );
    }
    return (
      <>
        <Button color={buttonColor.toLowerCase()}>{player.name}</Button>
        <Label color={buttonColor.toLowerCase()} basic>
          {teamPlayer.score}
        </Label>
      </>
    );
  };

  if (!player) {
    return <Loading />;
  }

  return (
    <div className="score-buttons">
      <div className="position-title" style={{ color: textColor }}>
        {teamPlayer.position}
      </div>
      <Button
        labelPosition={left ? "left" : "right"}
        onClick={handleClick}
        disabled={disabled}
        as="div"
      >
        <ButtonContent />
      </Button>
    </div>
  );
};

const ScoreButtons = ({
  team,
  setPlayerScores,
  buttonColor,
  textColor,
  left,
  disabled,
}) => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [scored, setScored] = useState(0);

  // get team players
  useEffect(() => {
    const getTeamPlayers = async teamId => {
      const { data } = await tracker.get(`/teams/${teamId}/players`, {
        params: {
          token: getDigest("get", "/teams/:id/players"),
        },
      });
      const returnedTeamPlayers = await data;
      setTeamPlayers(_.orderBy(returnedTeamPlayers, ["position"], ["asc"]));
    };
    if (!!team) {
      const { id: teamId } = team;
      getTeamPlayers(teamId);
    }
  }, [team, scored]);

  // update team score
  useEffect(() => {
    if (!_.isEmpty(teamPlayers)) {
      setPlayerScores(ts => {
        return _.reduce(
          teamPlayers,
          (acc, teamPlayer) => {
            return { ...acc, [teamPlayer.id]: teamPlayer.score };
          },
          ts,
        );
      });
    }
  }, [teamPlayers, setPlayerScores]);

  if (_.isEmpty(teamPlayers)) {
    return <Loading />;
  }

  return _.map(teamPlayers, teamPlayer => {
    return (
      <ScoreButton
        currentTeamName={team.name}
        teamPlayer={teamPlayer}
        left={left}
        buttonColor={buttonColor}
        textColor={textColor}
        disabled={disabled}
        setPlayerScores={setPlayerScores}
        setScored={setScored}
        key={teamPlayer.id}
      />
    );
  });
};

export default ScoreButtons;
