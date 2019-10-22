import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Header, Icon, Message } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { encryptData } from "../../../helpers/aes";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import "../../../styles/adminDashboard/usersPane/userModal.css";

const DeleteUserConfirmationModal = ({
  showConfirmationModal,
  setShowConfirmationModal,
  user,
  setUserDeleted,
  setShowEditModal,
}) => {
  const { addFlash } = useContext(FlashContext);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(_.isEmpty(user));
  }, [user]);

  const handleConfirmation = async event => {
    event.preventDefault();
    try {
      await tracker.delete(`/users/${user.id}`, {
        params: {
          token: getDigest("delete", "/users/:id"),
        },
      });
      setUserDeleted(user);

      await tracker.post(
        "/logs",
        {
          actionType: "USER_DELETED",
          objectType: "users",
          objectId: user.id,
          objectJson: JSON.stringify(user),
        },
        { params: { token: getDigest("post", "/logs") } },
      );
    } catch (error) {
      addFlash(`failed to delete user`);
      return null;
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
        Are you sure you want to delete this user? This cannot be undone
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

const EditUserModal = ({
  showModal,
  setShowModal,
  setUserUpdated,
  setUserDeleted,
}) => {
  const { addFlash } = useContext(FlashContext);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");
  const [userFormValid, setUserFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const userEmailBlank = _.isEmpty(userEmail);
    const passwordConfirmed = userPassword === userPasswordConfirmation;
    setUserFormValid(!userEmailBlank && passwordConfirmed);
    setFormErrors(oErrors => {
      return {
        ...oErrors,
        email: userEmailBlank ? (
          <Message error content="email cannot be blank" />
        ) : null,
        password: passwordConfirmed ? null : (
          <Message error content="password and confirmation do not match" />
        ),
      };
    });
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
    <Modal
      trigger={null}
      open={!!showModal}
      onClose={() => setShowModal(false)}
      basic
    >
      <Header>
        <Icon.Group size="big">
          <Icon name="user" />
          <Icon corner color="black" name="pencil" />
        </Icon.Group>{" "}
        Edit User
      </Header>
      <Form inverted onSubmit={handleSubmit} error>
        <Form.Input
          name="email"
          type="text"
          label="email"
          placeholder="email..."
          value={userEmail}
          onChange={(_event, { value }) => setUserEmail(value)}
        />
        {formErrors.email}
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
        {formErrors.password}
        <Button disabled={!userFormValid} id="submit-btn">
          Submit
        </Button>
        <DeleteUserConfirmationModal
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
          user={showModal}
          setUserDeleted={setUserDeleted}
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
    </Modal>
  );
};

export default EditUserModal;
