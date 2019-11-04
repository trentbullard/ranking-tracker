import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Form, Button, Dimmer, Loader, Dropdown } from "semantic-ui-react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { titleize } from "../helpers/string";
import history from "../history";
import BackArrow from "./utility/BackArrow";
import Log from "../helpers/log";

const NewGame = props => {
  const [timestamp] = useState(new Date());
  const [sport, setSport] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [valid, setValid] = useState(false);
  const [redKeeper, setRedKeeper] = useState({});
  const [redForward, setRedForward] = useState({});
  const [blueKeeper, setBlueKeeper] = useState({});
  const [blueForward, setBlueForward] = useState({});
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const getSport = async () => {
      const { data } = await tracker.get("/sports", {
        params: {
          enabled: true,
          token: getDigest("get", "/sports"),
        },
      });
      const returnedSports = await data;
      return returnedSports.find(value => {
        return value.name === titleize(props.match.params.sport);
      });
    };

    const getPlayers = async sportId => {
      const { data } = await tracker.get(`/players`, {
        params: { sportId, token: getDigest("get", "/players") },
      });
      const returnedPlayers = await data;
      return _.map(returnedPlayers, player => {
        return {
          key: player.name,
          text: player.name,
          value: player.id,
        };
      });
    };

    getSport()
      .then(returnedSport => {
        setSport(returnedSport);
        return returnedSport.id;
      })
      .then(sportId => {
        getPlayers(sportId).then(returnedPlayers => {
          setPlayers(returnedPlayers);
        });
      });
  }, [props.match.params.sport]);

  useEffect(() => {
    setSelectedValues(
      _.reduce(
        [redKeeper, redForward, blueKeeper, blueForward],
        (sigma, position) => {
          if (!_.isEmpty(position)) {
            return _.concat(sigma, position.value);
          }
          return sigma;
        },
        [],
      ),
    );
  }, [blueForward, blueKeeper, redForward, redKeeper]);

  useEffect(() => {
    setValid(selectedValues.length === 4);
  }, [selectedValues.length]);

  const handleSubmit = async event => {
    event.preventDefault();
    setTransitioning(true);

    const formValues = {
      eloAwarded: false,
      sport: sport.id,
      started: timestamp.toISOString(),
      teams: [
        {
          name: "Red",
          positions: [
            {
              name: "Keeper",
              player: {
                id: redKeeper.value,
              },
            },
            {
              name: "Forward",
              player: {
                id: redForward.value,
              },
            },
          ],
        },
        {
          name: "Blue",
          positions: [
            {
              name: "Keeper",
              player: {
                id: blueKeeper.value,
              },
            },
            {
              name: "Forward",
              player: {
                id: blueForward.value,
              },
            },
          ],
        },
      ],
    };

    const { data } = await tracker.post(`/games`, formValues, {
      params: { token: getDigest("post", "/games") },
    });

    const createdGame = await data;

    Log(
      "GAME_CREATED",
      createdGame.id,
      createdGame,
      null,
      "games",
      props.currentUser.id,
    );

    return createdGame.id;
  };

  const PlayerSelect = ({ name, label, callback, ...rest }) => {
    const availablePlayers = _.reduce(
      players,
      (sigma, player) => {
        if (
          rest.value === player.value ||
          !selectedValues.includes(player.value)
        ) {
          return _.concat(sigma, player);
        }
        return sigma;
      },
      [],
    );
    return (
      <Form.Field
        {...rest}
        name={name || label}
        label={label}
        placeholder="Select Player"
        options={availablePlayers}
        search
        selection
        control={Dropdown}
        onChange={(_event, { value }) => {
          callback(_.find(players, { value }) || {});
        }}
        clearable
      />
    );
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
            history.push(`/games/score/${gameId}`);
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
        <PlayerSelect
          label="Red Keeper"
          value={redKeeper.value}
          callback={setRedKeeper}
        />
        <PlayerSelect
          label="Red Forward"
          value={redForward.value}
          callback={setRedForward}
        />
        <PlayerSelect
          label="Blue Keeper"
          value={blueKeeper.value}
          callback={setBlueKeeper}
        />
        <PlayerSelect
          label="Blue Forward"
          value={blueForward.value}
          callback={setBlueForward}
        />
        <Button type="submit" disabled={!valid}>
          Submit
        </Button>
      </Form>
      <BackArrow url="/" />
    </>
  );
};

export default NewGame;
