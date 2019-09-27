import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import { FlashContext } from "./FlashContext";

export const AuthContext = React.createContext();

const AuthProvider = props => {
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [referrer, setReferrer] = useState("/");
  const [fetching, setFetching] = useState(true);

  const { addFlash } = useContext(FlashContext);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: [returnedUser],
      } = await tracker.get("/session", {
        params: {
          sessionId: Cookies.get("mrank-session-id"),
          token: getDigest("get", "/session"),
        },
      });
      const user = await returnedUser;
      setCurrentUser(user);
    };

    setFetching(true);
    getSession().then(() => {
      setFetching(false);
    });
  }, []);

  const logout = () => {
    setReferrer("/");
    Cookies.remove("mrank-session-id");
    setSessionId(null);
    setCurrentUser(null);
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
    fetching,
  };

  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
