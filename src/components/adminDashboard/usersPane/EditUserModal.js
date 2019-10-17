import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Header, Icon } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { encryptData } from "../../../helpers/aes";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import "../../../styles/adminDashboard/usersPane/userModal.css";

const EditUserModal = ({ showModal, setShowModal, setUserUpdated }) => {
  const { addFlash } = useContext(FlashContext);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");
  const [userFormValid, setUserFormValid] = useState(false);

  useEffect(() => {
    const userEmailBlank = _.isEmpty(userEmail);
    const passwordConfirmed = userPassword === userPasswordConfirmation;
    setUserFormValid(!userEmailBlank && passwordConfirmed);
  }, [userEmail, userPassword, userPasswordConfirmation]);

  useEffect(() => {
    if (!!showModal) {
      const { email } = showModal;
      setUserEmail(email);
    }
  }, [showModal]);

  const handleSubmit = async event => {
    event.preventDefault();

    const formValues = {
      userId: showModal.id,
      email: userEmail,
      password: userPassword,
    };
    console.log(`TCL: formValues`, formValues);

    const cipher = encryptData(formValues);
    let returnedUser;
    try {
      const response = await tracker.patch(
        `/users/${formValues.userId}`,
        {},
        {
          params: {
            cipher,
            token: getDigest("patch", "/users/:id"),
          },
        },
      );
      returnedUser = await response.data;
    } catch (error) {
      addFlash(`failed to create user`);
      setShowModal(false);
      return null;
    }
    setUserUpdated(returnedUser);
    setShowModal(false);

    await tracker.post(
      "/logs",
      {
        actionType: "USER_UPDATED",
        objectType: "users",
        objectId: returnedUser.id,
        objectJson: JSON.stringify(returnedUser),
      },
      { params: { token: getDigest("post", "/logs") } },
    );
  };

  return (
    <Modal trigger={null} open={!!showModal} basic>
      <Header>
        <Icon.Group size="big">
          <Icon name="user" />
          <Icon corner color="black" name="pencil" />
        </Icon.Group>
        Edit User
      </Header>
      <Form inverted onSubmit={handleSubmit}>
        <Form.Input
          name="email"
          type="text"
          label="email"
          placeholder="email..."
          value={userEmail}
          onChange={(_event, { value }) => setUserEmail(value)}
        />
        <Form.Input
          name="password"
          type="password"
          label="edit password"
          placeholder="password..."
          value={userPassword}
          onChange={(_event, { value }) => setUserPassword(value)}
        />
        <Form.Input
          name="passwordConfirmation"
          type="password"
          label="edit password confirmation"
          placeholder="password again..."
          value={userPasswordConfirmation}
          onChange={(_event, { value }) => setUserPasswordConfirmation(value)}
        />
        <Button disabled={!userFormValid} id="submit-btn">
          Submit
        </Button>
        <Button
          className="ui button negative"
          floated="right"
          onClick={_event => setShowModal(null)}
        >
          Cancel
        </Button>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
