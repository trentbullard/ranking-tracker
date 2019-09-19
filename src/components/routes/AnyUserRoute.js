import _ from "lodash";
import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: Component, currentUser, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      _.isEmpty(currentUser) ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);
