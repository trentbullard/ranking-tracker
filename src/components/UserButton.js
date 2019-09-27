import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Loader } from "semantic-ui-react";
import { AuthContext } from "../contexts/AuthContext";
import history from "../history";
import "../styles/userButton.css";

const UserButtonWrapper = ({ children }) => {
  return <div className="user-button">{children}</div>;
};

const UserButton = () => {
  const authContext = useContext(AuthContext);
  if (authContext.fetching) {
    return (
      <UserButtonWrapper>
        <Loader active inline />
      </UserButtonWrapper>
    );
  }
  if (!!authContext.currentUser) {
    return (
      <UserButtonWrapper>
        <Link to={`/users/${authContext.currentUser.id}`}>
          <Button attached="left" color="blue">
            Profile
          </Button>
        </Link>
        <Button onClick={authContext.logout} attached="right" color="red">
          Logout
        </Button>
      </UserButtonWrapper>
    );
  }
  return (
    <UserButtonWrapper>
      <Button onClick={() => history.push("/login")} circular color="green">
        Login
      </Button>
    </UserButtonWrapper>
  );
};

export default UserButton;
