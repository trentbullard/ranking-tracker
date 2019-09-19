import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";

export default ({ component: Component, ...rest }) => {
  return (
    <AppContext.Consumer>
      {context => {
        let toRender = _props => <Redirect to="/login" />;
        if (
          !!context.currentUser &&
          (rest.computedMatch.params.id === context.currentUser.id.toString() ||
            context.currentUser.isadmin)
        ) {
          toRender = props => <Component {...props} />;
        } else {
          context.setReferrer(rest.location.pathname);
        }
        return <Route {...rest} render={toRender} />;
      }}
    </AppContext.Consumer>
  );
};
