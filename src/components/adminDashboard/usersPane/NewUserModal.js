import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Header } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { encryptData } from "../../../helpers/aes";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import { log } from "../../../helpers/log";
import "../../../styles/adminDashboard/usersPane/userModal.css";

const NewUserModal = props => {
  const { addFlash } = useContext(FlashContext);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [
    newUserPasswordConfirmation,
    setNewUserPasswordConfirmation,
  ] = useState("");
  const [newUserFormValid, setNewUserFormValid] = useState(false);

  useEffect(() => {
    const newUserEmailBlank = _.isEmpty(newUserEmail);
    const newUserPasswordBlank = _.isEmpty(newUserPassword);
    const newUserPasswordConfirmationBlank = _.isEmpty(
      newUserPasswordConfirmation,
    );
    const passwordConfirmed = newUserPassword === newUserPasswordConfirmation;
    setNewUserFormValid(
      !newUserEmailBlank &&
        !newUserPasswordBlank &&
        !newUserPasswordConfirmationBlank &&
        passwordConfirmed,
    );
  }, [newUserEmail, newUserPassword, newUserPasswordConfirmation]);

  const handleSubmit = async event => {
    event.preventDefault();

    const formValues = {
      email: newUserEmail,
      password: newUserPassword,
    };

    const cipher = encryptData(formValues);
    let returnedUser;
    try {
      const response = await tracker.post(
        "/users",
        {},
        {
          params: {
            cipher,
            token: getDigest("post", "/users"),
          },
        },
      );
      returnedUser = await response.data;
      props.userAdded(returnedUser);
      log(
        "USER_CREATED",
        returnedUser.id,
        returnedUser,
        null,
        "users",
        props.currentUser.id,
      );
      addFlash(`user created successfully`);
    } catch (error) {
      console.log(`failed to create user: `, error.stack);
      addFlash(`failed to create user`);
    }
    props.setShowModal(false);
  };

  return (
    <Modal trigger={props.children} open={!!props.showModal} basic>
      <Header icon="add user" content="Create User" />
      <Form inverted onSubmit={handleSubmit}>
        <Form.Input
          name="email"
          type="text"
          label="email"
          placeholder="email..."
          value={newUserEmail}
          onChange={(event, { value }) => {
            event.preventDefault();
            setNewUserEmail(value);
          }}
        />
        <Form.Input
          name="password"
          type="password"
          label="password"
          placeholder="password..."
          value={newUserPassword}
          onChange={(event, { value }) => {
            event.preventDefault();
            setNewUserPassword(value);
          }}
        />
        <Form.Input
          name="passwordConfirmation"
          type="password"
          label="password confirmation"
          placeholder="password again..."
          value={newUserPasswordConfirmation}
          onChange={(event, { value }) => {
            event.preventDefault();
            setNewUserPasswordConfirmation(value);
          }}
        />
        <Button disabled={!newUserFormValid} id="submit-btn">
          Submit
        </Button>
        <Button
          className="ui button negative"
          floated="right"
          onClick={_event => props.setShowModal(false)}
        >
          Cancel
        </Button>
      </Form>
    </Modal>
  );
};

export default NewUserModal;
