import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { AuthContext } from "../contexts/AuthContext";
import history from "../history";

const UserButton = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "15px",
        fontSize: "2em",
      }}
    >
      <AuthContext.Consumer>
        {context => {
          if (!!context.currentUser) {
            return (
              <>
                <Link to={`/users/${context.currentUser.id}`}>
                  <Button attached="left" color="blue">
                    Profile
                  </Button>
                </Link>
                <Button onClick={context.logout} attached="right" color="red">
                  Logout
                </Button>
              </>
            );
          }
          return (
            <Button
              onClick={() => history.push("/login")}
              circular
              color="green"
            >
              Login
            </Button>
          );
        }}
      </AuthContext.Consumer>
    </div>
  );
};

export default UserButton;
