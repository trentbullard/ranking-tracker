import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { encryptData } from "../../../helpers/aes";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";

const NewPlayerModal = props => {
  return(
    <Modal trigger={props.children} basic>
      <Modal.Header>Add Player</Modal.Header>
      <Modal.Content>
        create player form
        <Modal.Description>
          where new players can be added
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default NewPlayerModal;