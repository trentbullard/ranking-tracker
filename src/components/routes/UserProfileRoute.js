import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FlashContext } from "../../contexts/FlashContext";

export default ({ component: Component, ...rest }) => {
  const { addFlash } = useContext(FlashContext);

  return (
    <AuthContext.Consumer>
      {context => {
        let toRender = _props => <Redirect to="/login" />;
        if (!context.currentUser) {
          addFlash("you must login to access that page");
          context.setReferrer(rest.location.pathname);
        } else if (
          rest.computedMatch.params.id !== context.currentUser.id.toString() &&
          !context.currentUser.isadmin
        ) {
          toRender = _props => <Redirect to="/" />;
          addFlash("you are not authorized to access that page");
        } else {
          toRender = props => <Component {...props} />;
        }
        return <Route {...rest} render={toRender} />;
      }}
    </AuthContext.Consumer>
  );
};
