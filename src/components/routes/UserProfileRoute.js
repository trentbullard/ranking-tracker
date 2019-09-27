import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { AuthContext } from "../../contexts/AuthContext";
import { FlashContext } from "../../contexts/FlashContext";

const UserProfileRoute = ({ component: Component, ...rest }) => {
  const { addFlash } = useContext(FlashContext);
  const { fetching, currentUser, setReferrer } = useContext(AuthContext);

  if (fetching) {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  } else if (!fetching && !currentUser) {
    addFlash("you must login to access that page");
    setReferrer(rest.location.pathname);
    return <Redirect to="/login" />;
  } else if (
    rest.computedMatch.params.userId !== currentUser.id.toString() &&
    !currentUser.isAdmin
  ) {
    addFlash("you are not authorized to access that page");
    return <Redirect to="/" />;
  } else {
    return <Route {...rest} render={props => <Component {...props} />} />;
  }
};

export default UserProfileRoute;
