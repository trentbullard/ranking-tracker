import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { log } from "../../../helpers/log";

const DeletePlayerConfirmationModal = ({
  showConfirmationModal,
  setShowConfirmationModal,
  player,
  setPlayerDeleted,
  setShowEditModal,
}) => {
  const { addFlash } = useContext(FlashContext);
  const { currentUser } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(_.isEmpty(player));
  }, [player]);

  const handleConfirmation = async event => {
    event.preventDefault();
    try {
      await tracker.delete(`/players/${player.id}`, {
        params: {
          token: getDigest("delete", "/players/:id"),
        },
      });
      setPlayerDeleted(player);

      log("PLAYER_DELETED", player.id, player, null, "players", currentUser.id);
      addFlash(`player deleted successfully`);
    } catch (error) {
      console.log(`failed to delete player: `, error.stack);
      addFlash(`failed to delete player`);
    }
    setShowConfirmationModal(false);
    setShowEditModal(false);
  };

  return (
    <Modal
      trigger={
        <Button
          type="button"
          onClick={() => setShowConfirmationModal(true)}
          color="red"
        >
          Delete
        </Button>
      }
      open={!!showConfirmationModal}
      onOpen={() => setShowConfirmationModal(true)}
      onClose={() => setShowConfirmationModal(false)}
    >
      <Modal.Content>
        Are you sure you want to delete this player? This cannot be undone.
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowConfirmationModal(false)} secondary>
          Nevermind
        </Button>
        <Button onClick={handleConfirmation} color="red" disabled={disabled}>
          I'm Sure
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeletePlayerConfirmationModal;
