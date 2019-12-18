import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Loader, List } from "semantic-ui-react";
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
        <List divided horizontal>
          <List.Item>
            <Link to={`/users/${authContext.currentUser.id}`}>
              <Button
                circular
                color="blue"
              >
                Profile
              </Button>
            </Link>
          </List.Item>
          <List.Item>
            <Button
              circular
              onClick={authContext.logout}
              color="red"
            >
              Logout
            </Button>
          </List.Item>
        </List>
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
