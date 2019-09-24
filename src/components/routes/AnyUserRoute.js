import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FlashContext } from "../../contexts/FlashContext";

export default ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const flashContext = useContext(FlashContext);

  let toRender = _props => <Redirect to="/login" />;
  if (!authContext.currentUser) {
    flashContext.addFlash("you must login to access that page");
    authContext.setReferrer(rest.location.pathname);
  } else {
    toRender = props => <Component {...props} />;
  }
  return <Route {...rest} render={toRender} />;
};
