import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { encryptData } from "../../../helpers/aes";
import { getDigest } from "../../../helpers/hmac";
import { FlashContext } from "../../../contexts/FlashContext";
import AdminCheckbox from "./AdminCheckbox";
import { log } from "../../../helpers/log";

const UserInfoPane = ({ currentUser }) => {
  const { addFlash } = useContext(FlashContext);
  const [formValues, setFormValues] = useState(currentUser);
  const [errors, setErrors] = useState({});

  // validate form
  useEffect(() => {
    setErrors({});
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
      addFlash(`user updated successfully`);
    } catch (error) {
      console.log("failed to update user: ", error.stack);
      addFlash(`failed to update user`);
    }
  };

  const handleReset = event => {
    event.preventDefault();
    setFormValues(fv => {
      return { ...currentUser, passwordConfirmation: "", password: "" };
    });
  };

  return (
    <Form onSubmit={handleSubmit} error>
      <AdminCheckbox
        user={currentUser}
        checked={formValues.isAdmin}
        setFormValues={setFormValues}
      />
      <Form.Input
        name="joined"
        label="joined"
        value={new Date(formValues.createdAt).toLocaleString("en-US")}
        readOnly
        transparent
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
        Save
      </Button>
      <Button onClick={handleReset}>Reset</Button>
    </Form>
  );
};

export default UserInfoPane;
