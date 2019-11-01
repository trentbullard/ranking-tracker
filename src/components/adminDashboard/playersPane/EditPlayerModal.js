import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Icon, Message } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import DeletePlayerConfirmationModal from "./DeletePlayerConfirmationModal";
import "../../../styles/adminDashboard/playersPane/playerModal.css";

const EditPlayerModal = ({
  showModal,
  setShowModal,
  setPlayerUpdated,
  setPlayerDeleted,
}) => {
  const { addFlash } = useContext(FlashContext);
  const [playerName, setPlayerName] = useState("");
  const [playerFormValid, setPlayerFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // form validation
  useEffect(() => {
    const playerNameBlank = _.isEmpty(playerName);
    setPlayerFormValid(!playerNameBlank);
    setFormErrors(oErrors => {
      return {
        ...oErrors,
        name: playerNameBlank ? (
          <Message error content="name cannot be blank" />
        ) : null,
      };
    });
  }, [playerName]);

  // set player name in form on load
  useEffect(() => {
    if (!!showModal) {
      const { name } = showModal;
      setPlayerName(name);
    }
  }, [showModal]);

  const handleSubmit = async event => {
    event.preventDefault();

    const formValues = {
      playerId: showModal.id,
      name: playerName,
    };

    let returnedPlayer;
    try {
      const response = await tracker.patch(
        `/players/${formValues.playerId}`,
        formValues,
        {
          params: {
            token: getDigest("patch", "/players/:id"),
          },
        },
      );
      returnedPlayer = await response.data;
    } catch (error) {
      addFlash(`failed to update player`);
      setShowModal(null);
      return null;
    }
    setPlayerUpdated(returnedPlayer);
    setShowModal(null);

    await tracker.post(
      "/logs",
      {
        actionType: "PLAYER_UPDATED",
        objectType: "players",
        objectId: returnedPlayer.id,
        objectJson: JSON.stringify(returnedPlayer),
      },
      { params: { token: getDigest("post", "/logs") } },
    );
  };

  return (
    <Modal
      trigger={null}
      open={!!showModal}
      onClose={() => setShowModal(null)}
      basic
    >
      <Modal.Header>
        <Icon.Group size="big">
          <Icon name="users" />
          <Icon corner color="black" name="pencil" />
        </Icon.Group>{" "}
        Edit Player
      </Modal.Header>
      <Modal.Content>
        <Form inverted onSubmit={handleSubmit} error>
          <Form.Input
            name="name"
            type="text"
            label="name"
            placeholder="name..."
            value={playerName}
            onChange={(_event, { value }) => setPlayerName(value)}
          />
          {formErrors.name}
          <Button disabled={!playerFormValid} id="submit-btn">
            Submit
          </Button>
          <DeletePlayerConfirmationModal
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
            player={showModal}
            setPlayerDeleted={setPlayerDeleted}
            setShowEditModal={setShowModal}
          />
          <Button
            className="ui button negative"
            floated="right"
            onClick={_event => setShowModal(null)}
          >
            Cancel
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default EditPlayerModal;
