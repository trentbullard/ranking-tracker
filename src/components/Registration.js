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
import { log } from "../helpers/log";

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

    let returnedUser;
    try {
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

      returnedUser = await data;

      if (!!returnedUser && !!returnedUser.error) {
        addFlash(returnedUser.message);
      } else if (!returnedUser) {
        addFlash("failed to create user");
      } else {
        log(
          "USER_CREATED",
          returnedUser.id,
          returnedUser,
          null,
          "users",
          returnedUser.id,
        );
        addFlash("registration successful");
      }
    } catch (error) {
      console.log("failed to complete user registration: ", error.stack);
      addFlash("failed to complete user registration");
    }

    if (!!returnedUser && !!returnedUser.error) {
      try {
        Cookies.set("mrank-session-id", returnedUser.sessionid);
        setSessionId(returnedUser.sessionid);
        setCurrentUser(returnedUser);
        addFlash("logged in successfully");
      } catch (error) {
        console.log("failed to login with registered user: ", error.stack);
        addFlash("failed to login with registered user");
      }
    }
    setLoading(false);
    history.push(`/users/${returnedUser.id}`);
  };

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  return (
    <Form className="ui form" onSubmit={handleSubmit}>
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
