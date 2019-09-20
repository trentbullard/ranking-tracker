import _ from "lodash";
import React, { useState } from "react";
import { encryptData } from "../helpers/aes";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import Cookies from "js-cookie";

export const AppContext = React.createContext();

export default props => {
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [flash, setFlash] = useState([]);
  const [referrer, setReferrer] = useState("/");

  const submitLogin = async event => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const cipher = encryptData({ email, password });
    const {
      data: [returnedUser],
    } = await tracker.get("/auth", {
      params: {
        cipher,
        token: getDigest("get", "/auth"),
      },
    });
    if (!!returnedUser && !!returnedUser.error) {
      setFlash(
        _.concat(flash, `${returnedUser.message}: ${returnedUser.error}`),
      );
      return null;
    } else if (!returnedUser) {
      setFlash(_.concat(flash, `username or password incorrect`));
      return null;
    }
    setCurrentUser(returnedUser);
    const userId = returnedUser.id;
    const {
      data: { sessionId },
    } = await tracker.post(
      "/login",
      {
        userId,
      },
      {
        params: {
          token: getDigest("post", "/login"),
        },
      },
    );
    setSessionId(sessionId);
    Cookies.set("mrank-session-id", sessionId);
    setFlash(_.concat(flash, "logged in successfully"));
  };

  const checkSession = async () => {
    const sessionId = Cookies.get("mrank-session-id");
    if (!!currentUser && currentUser.sessionId === sessionId) {
      return null;
    }
    setSessionId(sessionId);
    const {
      data: [returnedUser],
    } = await tracker.get("/session", {
      params: {
        sessionId,
        token: getDigest("get", "/session"),
      },
    });
    setCurrentUser(returnedUser);
    if (!!returnedUser) {
      setFlash(_.concat(flash, "welcome back"));
    }
  };

  const logout = () => {
    Cookies.remove("mrank-session-id");
    setSessionId(null);
    setCurrentUser(null);
    setFlash(_.concat(flash, "logged out successfully"));
    setReferrer("/");
  };

  const badRoute = () => {
    setFlash(_.concat(flash, "oops, the page you requested does not exist"));
  };

  const clearFlash = () => {
    setFlash([]);
  };

  const state = {
    sessionId,
    currentUser,
    flash,
    clearFlash,
    referrer,
    setReferrer,
    submitLogin,
    checkSession,
    logout,
    badRoute,
  };

  return (
    <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
  );
};
