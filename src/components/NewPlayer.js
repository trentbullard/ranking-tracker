import _ from "lodash";
import React, { useEffect, useState, useContext } from "react";
import { Button, Dimmer, Form, Loader } from "semantic-ui-react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import history from "../history";
import { FlashContext } from "../contexts/FlashContext";
import BackArrow from "./utility/BackArrow";
import Log from "../helpers/log";

const NewPlayer = ({ currentUser }) => {
  const { addFlash } = useContext(FlashContext);
  const [loading, setLoading] = useState(true);
  const [timestamp] = useState(new Date());
  const [valid, setValid] = useState(false);
  const [name, setName] = useState("");
  const [sports, setSports] = useState([]);
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const getSports = async () => {
      const { data } = await tracker.get("/sports", {
        params: {
          enabled: true,
          token: getDigest("get", "/sports"),
        },
      });
      const returnedSports = await data;
      return returnedSports;
    };

    const getNames = async () => {
      const { data } = await tracker.get(`/players`, {
        params: { token: getDigest("get", "/players") },
      });
      const returnedPlayers = await data;
      return _.uniq(_.map(returnedPlayers, "name"));
    };

    setLoading(true);
    getSports()
      .then(sports => {
        setSports(sports);
      })
      .then(() => {
        getNames().then(names => {
          setExistingNames(names);
          setLoading(false);
        });
      });
  }, []);

  useEffect(() => {
    setValid(!_.isEmpty(name) && !existingNames.includes(name));
  }, [existingNames, name]);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);

    const formValues = {
      name,
      sports,
      elo: 100,
    };

    const { data } = await tracker.post("/players", formValues, {
      params: {
        token: getDigest("post", "/players"),
      },
    });

    const returnedPlayer = await data;

    if (!!returnedPlayer && !!returnedPlayer.error) {
      addFlash(returnedPlayer.message);
      return null;
    } else if (!returnedPlayer) {
      addFlash("failed to create player");
      return null;
    }

    Log(
      "PLAYER_CREATED",
      returnedPlayer.id,
      returnedPlayer,
      null,
      "users",
      currentUser.id,
    );

    setLoading(false);
    return returnedPlayer;
  };

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  return (
    <>
      <h3 className="ui center aligned header">Create a New Player</h3>
      <Form
        className="ui form error"
        onSubmit={event =>
          handleSubmit(event)
            .then(() => history.push("/"))
            .then(() => {
              addFlash("player created successfully");
            })
        }
      >
        <Form.Input
          label="Created At"
          name="created"
          type="text"
          value={timestamp.toLocaleString("en-US")}
          readOnly
          autoComplete="off"
        />
        <Form.Input
          name="name"
          label="Name"
          value={name}
          onChange={(_event, { value }) => setName(value)}
          placeholder="Name..."
        />
        <Button type="submit" disabled={!valid}>
          Submit
        </Button>
        <Button
          className="ui button negative"
          floated="right"
          onClick={_event => history.push("/")}
        >
          Cancel
        </Button>
      </Form>
      <BackArrow url="/" />
    </>
  );
};

export default NewPlayer;
