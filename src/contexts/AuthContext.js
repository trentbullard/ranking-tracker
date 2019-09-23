import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { FlashContext } from "./FlashContext";

export const AuthContext = React.createContext();

const checkSession = async sessionId => {
  const {
    data: [returnedUser],
  } = await tracker.get("/session", {
    params: {
      sessionId,
      token: getDigest("get", "/session"),
    },
  });
  return returnedUser;
};

const AuthProvider = props => {
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [referrer, setReferrer] = useState("/");

  const { addFlash } = useContext(FlashContext);

  useEffect(() => {
    setSessionId(Cookies.get("mrank-session-id"));
    if (!currentUser && !!sessionId) {
      checkSession(sessionId).then(returnedUser => {
        setCurrentUser(returnedUser);
      });
    }
  }, [currentUser, sessionId]);

  const logout = () => {
    Cookies.remove("mrank-session-id");
    setSessionId(null);
    setCurrentUser(null);
    setReferrer("/");
    addFlash("signed out successfully");
  };

  const state = {
    sessionId,
    setSessionId,
    currentUser,
    setCurrentUser,
    referrer,
    setReferrer,
    logout,
  };

  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
