import React from "react";
import { Redirect } from "react-router-dom";
import LoginForm from "./forms/LoginForm";
import { AppContext } from "../contexts/AppContext";

export default () => (
  <>
    <AppContext.Consumer>
      {context => {
        if (!!context.currentUser) {
          return <Redirect to={context.referrer} />;
        }
        return (
          <>
            <h3 className="ui center aligned header" key="login-header">
              Login
            </h3>
            <LoginForm onSubmit={context.submitLogin} key="login-form" />
          </>
        );
      }}
    </AppContext.Consumer>
    <div className="ui hidden divider" style={{ margin: "2em 0" }} key="divider-2" />
  </>
);
