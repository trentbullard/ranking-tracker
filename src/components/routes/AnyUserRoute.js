import _ from "lodash";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default ({ component: Component, ...rest }) => {
  return (
    <AuthContext.Consumer>
      {context => {
        let toRender = _props => <Redirect to="/login" />;
        if (!context.currentUser) {
          context.setFlash(
            _.concat(context.flash, "you must login to access that page"),
          );
          context.setReferrer(rest.location.pathname);
        } else {
          toRender = props => <Component {...props} />;
        }
        return <Route {...rest} render={toRender} />;
      }}
    </AuthContext.Consumer>
  );
};
