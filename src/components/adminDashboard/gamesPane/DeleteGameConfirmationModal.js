import React, { useContext } from "react";
import { Modal, Button } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { log } from "../../../helpers/log";
import { FlashContext } from "../../../contexts/FlashContext";
import { AuthContext } from "../../../contexts/AuthContext";

const DeleteGameConfirmationModal = ({
  game,
  setShowModal,
  showModal,
  setShowGameModal,
}) => {
  const { addFlash } = useContext(FlashContext);
  const { currentUser } = useContext(AuthContext);

  const handleConfirm = async event => {
    event.preventDefault();
    try {
      await tracker.delete(`/games/${game.id}`, {
        params: {
          token: getDigest("delete", "/games/:id"),
        },
      });
      log("GAME_DELETED", game.id, game, null, "games", currentUser.id);
      addFlash(`game deleted successfully`);
    } catch (error) {
      console.log(`failed to delete game: `, error.stack);
      addFlash(`failed to delete game`);
    }
    setShowModal(false);
    setShowGameModal(false);
  };

  return(
    <Modal
      trigger={
        <Button
          floated="left"
          color="red"
          content="Delete"
          onClick={() => setShowModal(true)}
        />
      }
      open={!!showModal}
      onClose={() => setShowModal(false)}
      basic
    >
      <Modal.Content>Are you sure you want to delete this game? This cannot be undone!</Modal.Content>
      <Modal.Actions>
        <Button color="red" content="Do it!" onClick={handleConfirm} />
        <Button secondary content="nvm" onClick={() => setShowModal(false)} />
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteGameConfirmationModal
