import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Header, Icon } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { encryptData } from "../../../helpers/aes";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import { log } from "../../../helpers/log";
import "../../../styles/adminDashboard/usersPane/userModal.css";
import AdminCheckbox from "./AdminCheckbox";

const emptyValues = {
  createdAt: new Date().toLocaleString("en-us"),
  email: "",
  password: "",
  passwordConfirmation: "",
  firstName: "",
  lastName: "",
  isAdmin: false,
};

const DeleteUserConfirmationModal = ({
  showConfirmationModal,
  setShowConfirmationModal,
  user,
  setUserDeleted,
  setShowEditModal,
  currentUser,
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
      log("USER_DELETED", user.id, user, null, "users", currentUser.id);
      addFlash(`user deleted successfully`);
    } catch (error) {
      console.log(`failed to delete user: `, error.stack);
      addFlash(`failed to delete user`);
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
        Are you sure you want to delete this user? This cannot be undone.
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
  currentUser,
}) => {
  const { addFlash } = useContext(FlashContext);
  const [formValues, setFormValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // populate form on selection
  useEffect(() => {
    setFormValues(showModal);
  }, [showModal]);

  // validate form
  useEffect(() => {
    setErrors({});
    if (_.isEmpty(formValues)) {
      return;
    }
    if (_.isEmpty(formValues.email)) {
      setErrors(e => {
        return { ...e, email: "required" };
      });
    }
    if (
      !_.isEmpty(formValues.password) ||
      !_.isEmpty(formValues.passwordConfirmation)
    ) {
      if (formValues.password !== formValues.passwordConfirmation) {
        setErrors(e => {
          return { ...e, passwordConfirmation: "doesn't match" };
        });
      } else {
      }
    }
  }, [formValues]);

  const handleSubmit = async event => {
    event.preventDefault();

    const cipher = encryptData(formValues);
    try {
      const { data } = await tracker.patch(
        `/users/${formValues.id}`,
        {},
        {
          params: {
            cipher,
            token: getDigest("patch", "/users/:id"),
          },
        },
      );
      const returnedUser = await data;
      if (!returnedUser || _.isEmpty(returnedUser)) {
        console.log("failed to update user: check api logs");
        addFlash(`failed to update user, reason unknown`);
        return;
      }
      log(
        "USER_UPDATED",
        returnedUser.id,
        returnedUser,
        null,
        "users",
        currentUser.id,
      );
      setUserUpdated(returnedUser);
      addFlash(`user updated successfully`);
    } catch ({ message }) {
      console.log("failed to update user: ", message);
      if (message.includes("status code 403")) {
        addFlash(`email already taken`);
      } else {
        addFlash(`failed to update user`);
      }
    }
    setShowModal(false);
  };

  if (_.isEmpty(formValues)) {
    return null;
  }

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
        <AdminCheckbox
          user={currentUser}
          checked={formValues.isAdmin}
          setFormValues={setFormValues}
        />
        <Form.Input
          name="joined"
          label="joined (read-only)"
          value={new Date(formValues.createdAt).toLocaleString("en-US")}
          readOnly
          autoComplete="off"
        />
        <Form.Input
          error={errors.email}
          name="email"
          label="email"
          placeholder="email..."
          value={formValues.email}
          onChange={(_event, { value }) =>
            setFormValues(fv => {
              return { ...fv, email: value };
            })
          }
        />
        Leave blank for no change
        <Form.Input
          error={errors.password}
          name="password"
          type="password"
          label="password"
          placeholder="password..."
          value={formValues.password}
          onChange={(_event, { value }) =>
            setFormValues(fv => {
              return { ...fv, password: value };
            })
          }
        />
        <Form.Input
          error={errors.passwordConfirmation}
          name="passwordConfirmation"
          type="password"
          label="password confirmation"
          placeholder="password again..."
          value={formValues.passwordConfirmation}
          onChange={(_event, { value }) =>
            setFormValues(fv => {
              return { ...fv, passwordConfirmation: value };
            })
          }
        />
        <Form.Input
          error={errors.firstName}
          name="firstName"
          label="first name"
          placeholder="first name"
          value={formValues.firstName}
          onChange={(_event, { value }) =>
            setFormValues(fv => {
              return { ...fv, firstName: value };
            })
          }
        />
        <Form.Input
          error={errors.lastName}
          name="lastName"
          label="last name"
          placeholder="last name"
          value={formValues.lastName}
          onChange={(_event, { value }) =>
            setFormValues(fv => {
              return { ...fv, lastName: value };
            })
          }
        />
        <Button disabled={!_.isEmpty(errors)} id="submit-btn">
          Submit
        </Button>
        <DeleteUserConfirmationModal
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
          user={showModal}
          setUserDeleted={setUserDeleted}
          setShowEditModal={setShowModal}
          currentUser={currentUser}
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
