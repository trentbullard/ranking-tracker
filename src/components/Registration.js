import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Button, Dimmer, Form, Loader } from "semantic-ui-react";
import Cookies from "js-cookie";
import tracker from "../apis/tracker";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";
import { encryptData } from "../helpers/aes";
import { getDigest } from "../helpers/hmac";
import history from "../history";

const Registration = props => {
  const { setCurrentUser, setSessionId } = useContext(AuthContext);
  const { addFlash } = useContext(FlashContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailEmpty = _.isEmpty(email);
    const passwordEmpty = _.isEmpty(password);
    const passwordConfirmationEmpty = _.isEmpty(passwordConfirmation);
    const passwordAndConfirmationMatch = password === passwordConfirmation;
    const allValidations =
      !emailEmpty &&
      !passwordEmpty &&
      !passwordConfirmationEmpty &&
      passwordAndConfirmationMatch;
    setValid(allValidations);
  }, [email, password, passwordConfirmation]);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);

    const formValues = {
      email,
      password,
    };

    const cipher = encryptData(formValues);
    const { data } = await tracker.post(
      "/users",
      {},
      {
        params: {
          cipher,
          token: getDigest("post", "/users"),
        },
      },
    );

    const returnedUser = await data;

    if (!!returnedUser && !!returnedUser.error) {
      addFlash(returnedUser.message);
      return null;
    } else if (!returnedUser) {
      addFlash("failed to create user");
      return null;
    }

    await tracker.post(
      "/logs",
      {
        actionType: "USER_CREATED",
        objectType: "users",
        objectId: returnedUser.id,
        objectJson: JSON.stringify(returnedUser),
      },
      { params: { token: getDigest("post", "/logs") } },
    );

    Cookies.set("mrank-session-id", returnedUser.sessionid);
    setSessionId(returnedUser.sessionid);
    setCurrentUser(returnedUser);
    addFlash("logged in successfully");

    setLoading(false);
    return returnedUser.id;
  };

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  return (
    <Form
      className="ui form"
      onSubmit={event =>
        handleSubmit(event)
          .then(userId => {
            history.push(`/users/${userId}`);
          })
          .then(() => {
            addFlash("user created successfully");
          })
      }
    >
      <Form.Input
        name="email"
        type="text"
        label="email"
        placeholder="Email..."
        onChange={(_event, { value }) => setEmail(value)}
      />
      <Form.Input
        name="password"
        type="password"
        label="Password"
        placeholder="Password..."
        onChange={(_event, { value }) => setPassword(value)}
      />
      <Form.Input
        name="passwordConfirmation"
        type="password"
        label="Password Confirmation"
        placeholder="Password Again..."
        onChange={(_event, { value }) => setPasswordConfirmation(value)}
      />
      <Button disabled={!valid}>Submit</Button>
      <Button
        className="ui button negative"
        floated="right"
        onClick={_event => history.push("/")}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default Registration;
