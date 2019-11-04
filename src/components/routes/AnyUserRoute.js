import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { AuthContext } from "../../contexts/AuthContext";
import { FlashContext } from "../../contexts/FlashContext";

const AnyUserRoute = ({ component: Component, ...rest }) => {
  const { fetching, currentUser, setReferrer } = useContext(AuthContext);
  const { addFlash } = useContext(FlashContext);

  if (fetching) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  } else if (!currentUser) {
    addFlash("you must login to access that page");
    setReferrer(rest.location.pathname);
    return <Redirect to="/login" />;
  } else {
    return (
      <Route
        {...rest}
        render={props => <Component {...props} currentUser={currentUser} />}
      />
    );
  }
};

export default AnyUserRoute;
