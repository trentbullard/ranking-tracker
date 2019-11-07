import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Dimmer, Loader } from "semantic-ui-react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import history from "../history";
import BackArrow from "./utility/BackArrow";
import { log } from "../helpers/log";
import { FlashContext } from "../contexts/FlashContext";
import PlayerSelect from "./newGame/PlayerSelect";
import SportProvider, { SportContext } from "../contexts/SportContext";

const NewGame = props => {
  const [timestamp] = useState(new Date());
  const [sport, setSport] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [valid, setValid] = useState(false);
  const [teamNames, setTeamNames] = useState(null);
  const [positionNames, setPositionNames] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  const { addFlash } = useContext(FlashContext);
  const { sports } = useContext(SportContext);

  // get sport
  useEffect(() => {
    if (!_.isEmpty(sports)) {
      setSport(
        sports.find(value => {
          return (
            value.name.toLowerCase() === props.match.params.sport.toLowerCase()
          );
        }),
      );
    }
  }, [props.match.params.sport, sports]);

  // get players
  useEffect(() => {
    const getPlayers = async sportId => {
      const { data } = await tracker.get(`/players`, {
        params: { sportId, token: getDigest("get", "/players") },
      });
      const returnedPlayers = await data;
      setPlayers(
        _.map(returnedPlayers, player => {
          return {
            key: player.name,
            text: player.name,
            value: player.id,
          };
        }),
      );
    };

    if (!!sport) {
      getPlayers(sport.id);
    }
  }, [sport]);

  // set available players
  useEffect(() => {
    setAvailablePlayers(
      _.filter(players, value => {
        return !_.reduce(
          teamNames,
          (acc, team) => {
            return (
              acc ||
              _.reduce(
                positionNames,
                (acc2, position) => {
                  return (
                    acc2 ||
                    value.value === selectedValues[team][position || "Player"]
                  );
                },
                false,
              )
            );
          },
          false,
        );
      }),
    );
  }, [players, positionNames, selectedValues, teamNames]);

  // set valid
  useEffect(() => {
    const { length } = selectedValues;
    setValid(length === 4);
  }, [selectedValues]);

  // set team and position names
  useEffect(() => {
    if (!!sport) {
      setTeamNames(sport.teamNames.split(","));
      if (sport.playersPerTeam > 1) {
        setPositionNames(sport.positionNames.split(","));
      } else {
        setPositionNames([""]);
      }
      setSelectedValues(sv => {
        const sportTeams = {};
        _.each(sport.teamNames.split(","), team => {
          sportTeams[team] = {};
        });
        return sportTeams;
      });
    }
  }, [sport]);

  const handleSubmit = async event => {
    event.preventDefault();
    setTransitioning(true);

    const teams = _.reduce(
      teamNames,
      (acc, team) => {
        return acc.push({
          name: team,
          positions: _.reduce(positionNames, (acc2, position) => {
            return acc2.push({
              name: position,
              player: { id: selectedValues[team][position] },
            });
          }),
        });
      },
      [],
    );

    const formValues = {
      eloAwarded: false,
      sport: sport.id,
      started: timestamp.toISOString(),
      teams,
    };
    console.log(`TCL: formValues`, formValues);
    return null;

    let createdGame;
    try {
      const { data } = await tracker.post(`/games`, formValues, {
        params: { token: getDigest("post", "/games") },
      });
      createdGame = await data;
      log(
        "GAME_CREATED",
        createdGame.id,
        createdGame,
        null,
        "games",
        props.currentUser.id,
      );
      return createdGame.id;
    } catch (error) {
      console.log("failed to create game: ", error.stack);
      addFlash("failed to create game");
      return null;
    }
  };

  const PlayerFields = () => {
    return _.map(teamNames, team => {
      return _.map(positionNames, position => {
        const selectedPlayer = _.find(players, [
          "value",
          selectedValues[team][position || "Player"],
        ]);
        return (
          <PlayerSelect
            team={team}
            position={position}
            label={`${team} ${position}`}
            value={selectedPlayer}
            availablePlayers={availablePlayers}
            setSelectedValues={setSelectedValues}
            key={`select-${team}-${position}`}
          />
        );
      });
    });
  };

  if (!sport || _.isEmpty(players) || transitioning) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  return (
    <>
      <h3 className="ui center aligned header">
        {`Start a ${sport.name + " "}Game`}
      </h3>
      <Form
        className="ui form error"
        onSubmit={event =>
          handleSubmit(event).then(gameId => {
            gameId && history.push(`/games/score/${gameId}`);
          })
        }
      >
        <Form.Input
          label="Timestamp"
          name="started"
          type="text"
          value={timestamp.toLocaleString("en-US")}
          readOnly
          autoComplete="off"
        />
        <Form.Field name="sport" value={sport.id} hidden />
        <PlayerFields />
        <Button type="submit" disabled={!valid}>
          Submit
        </Button>
      </Form>
      <BackArrow url="/" />
    </>
  );
};

const NewGameProvider = props => (
  <SportProvider>
    <NewGame {...props} />
  </SportProvider>
);

export default NewGameProvider;
