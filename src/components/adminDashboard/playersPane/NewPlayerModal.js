import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Icon } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import { SportContext } from "../../../contexts/SportContext";
import { log } from "../../../helpers/log";

const NewPlayerModal = ({
  setPlayerAdded,
  showModal,
  setShowModal,
  children,
  currentUser,
}) => {
  const [timestamp, setTimestamp] = useState(new Date());
  const [valid, setValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [existingNames, setExistingNames] = useState([]);

  const { addFlash } = useContext(FlashContext);
  const { sports } = useContext(SportContext);

  // get player names
  useEffect(() => {
    const getNames = async () => {
      const { data } = await tracker.get(`/players/names`, {
        params: { token: getDigest("get", "/players/names") },
      });
      const returnedNames = await data;
      setExistingNames(returnedNames);
    };
    getNames();
  }, []);

  // real-time timestamp
  useEffect(() => {
    const id = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // form validation
  useEffect(() => {
    const nameBlank = _.isEmpty(name.trim());
    const nameTaken = !_.isEmpty(
      _.find(existingNames, oName => {
        return oName.name === name;
      }),
    );
    setValid(!nameBlank && !nameTaken);
    setErrors(oErrors => {
      return {
        ...oErrors,
        name: nameBlank
          ? { content: "can't be blank" }
          : nameTaken
          ? { content: "name taken" }
          : null,
      };
    });
  }, [existingNames, name]);

  const handleSubmit = async event => {
    event.preventDefault();

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
    } else if (!returnedPlayer) {
      addFlash("failed to create player");
    } else {
      addFlash("player created successfully");
      setPlayerAdded(returnedPlayer);
      setName("");
      log(
        "PLAYER_CREATED",
        returnedPlayer.id,
        returnedPlayer,
        null,
        "players",
        currentUser.id,
      );
    }
    setShowModal(false);
  };

  return (
    <Modal
      trigger={children}
      open={!!showModal}
      onClose={() => setShowModal(false)}
      basic
    >
      <Modal.Header>
        <Icon.Group size="big">
          <Icon name="users" />
          <Icon corner color="black" name="pencil" />
        </Icon.Group>{" "}
        Add Player
      </Modal.Header>
      <Modal.Content>
        <Form inverted>
          <Form.Input
            label="created at"
            value={timestamp.toLocaleString("en-us")}
            readOnly
          />
          <Form.Input
            error={errors.name}
            label="name"
            value={name}
            onChange={(_event, { value }) => setName(value)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          id="submit-btn"
          content="Submit"
          color="green"
          onClick={handleSubmit}
          disabled={!valid}
        />
        <Button
          content="Cancel"
          color="red"
          onClick={() => setShowModal(false)}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default NewPlayerModal;
