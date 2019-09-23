import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoginForm from "./forms/LoginForm";

const Login = _props => {
  const authContext = useContext(AuthContext);
  if (!!authContext.currentUser) {
    return <Redirect to={authContext.referrer} />;
  }
  return (
    <>
      <h3 className="ui center aligned header">Login</h3>
      <LoginForm />
      <div className="ui hidden divider" style={{ margin: "2em 0" }} />
    </>
  );
};

export default Login;
