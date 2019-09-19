import _ from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { AppContext } from "../contexts/AppContext";
import history from "../history";

export default () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "15px",
        fontSize: "2em",
      }}
    >
      <AppContext.Consumer>
        {context => {
          if (!!context.currentUser) {
            return (
              <>
                <Link to={`/users/${context.currentUser.id}`}>
                  <Button attached="left" color="blue">
                    Profile
                  </Button>
                </Link>
                <Button
                  onClick={context.logout}
                  attached="right"
                  color="red"
                >
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
      </AppContext.Consumer>
    </div>
  );
};
