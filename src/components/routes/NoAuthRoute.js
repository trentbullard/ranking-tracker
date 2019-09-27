import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { AuthContext } from "../../contexts/AuthContext";
import { FlashContext } from "../../contexts/FlashContext";

const NoAuthRoute = ({ component: Component, ...rest }) => {
  const { fetching, currentUser } = useContext(AuthContext);
  const { addFlash } = useContext(FlashContext);

  if (fetching) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  } else if (currentUser) {
    addFlash("you must logout to access that page");
    return <Redirect to="/" />;
  } else {
    return <Route {...rest} render={props => <Component {...props} />} />;
  }
};

export default NoAuthRoute;
