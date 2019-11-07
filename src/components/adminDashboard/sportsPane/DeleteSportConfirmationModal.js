import React, { useContext } from "react";
import { Modal, Button } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { log } from "../../../helpers/log";
import { FlashContext } from "../../../contexts/FlashContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { SportContext } from "../../../contexts/SportContext";

const DeleteSportConfirmationModal = ({
  sport,
  setShowModal,
  showModal,
  setShowSportModal,
}) => {
  const { addFlash } = useContext(FlashContext);
  const { currentUser } = useContext(AuthContext);

  const { setSportDeleted } = useContext(SportContext);

  const handleConfirm = async event => {
    event.preventDefault();
    try {
      await tracker.delete(`/sports/${sport.id}`, {
        params: {
          token: getDigest("delete", "/sports/:id"),
        },
      });
      setSportDeleted(sport);
      log("SPORT_DELETED", sport.id, sport, null, "sports", currentUser.id);
      addFlash(`player deleted successfully`);
    } catch (error) {
      console.log(`failed to delete player: `, error.stack);
      addFlash(`failed to delete player`);
    }
    setShowModal(false);
    setShowSportModal(false);
  };

  return (
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
      <Modal.Content>Are you sure you want to delete this sport?</Modal.Content>
      <Modal.Actions>
        <Button color="red" content="Do it!" onClick={handleConfirm} />
        <Button secondary content="nvm" onClick={() => setShowModal(false)} />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteSportConfirmationModal;
