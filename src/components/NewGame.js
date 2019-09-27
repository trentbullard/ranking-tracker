import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Form, Button, Dimmer, Loader, Dropdown } from "semantic-ui-react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { titleize } from "../helpers/string";

const NewGame = props => {
  const [timestamp] = useState(new Date().toLocaleString("en-US"));
  const [sport, setSport] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [valid, setValid] = useState(false);
  const [redKeeper, setRedKeeper] = useState({});
  const [redForward, setRedForward] = useState({});
  const [blueKeeper, setBlueKeeper] = useState({});
  const [blueForward, setBlueForward] = useState({});

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
  }, [props.match.params.sport, selectedPlayers]);

  useEffect(() => {
    setSelectedPlayers(
      _.reduce(
        [redKeeper, redForward, blueKeeper, blueForward],
        (sigma, position) => {
          if (!_.isEmpty(position)) {
            return _.concat(sigma, position);
          }
          return sigma;
        },
        [],
      ),
    );
  }, [blueForward, blueKeeper, redForward, redKeeper]);

  useEffect(() => {
    setValid(selectedPlayers.length === 4);
  }, [selectedPlayers.length]);

  const handleSubmit = event => {
    event.preventDefault();
    console.log(`TCL: event.target`, event.target);
  };

  const PlayerSelect = ({ name, label, callback, ...rest }) => (
    <Form.Field
      {...rest}
      name={name || label}
      label={label}
      placeholder="Select Player"
      options={players}
      search
      selection
      control={Dropdown}
      onChange={(_event, { value }) => {
        callback(_.find(players, { value }) || {});
      }}
      clearable
    />
  );

  if (!sport || _.isEmpty(players)) {
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
      <Form className="ui form error" onSubmit={handleSubmit}>
        <Form.Input
          label="Timestamp"
          name="started"
          type="text"
          value={timestamp}
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
    </>
  );
};

export default NewGame;
