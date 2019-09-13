import _ from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import history from "../history";
import { logout } from "../actions/loginActions";

const handleClickNewPlayerButton = (currentUser, logout) => {
  if (_.isEmpty(currentUser)) {
    history.push("/login");
    return null;
  }
  logout();
};

const UserButton = props => {
  const text = !_.isEmpty(props.currentUser) ? "Logout" : "Login";
  const color = !_.isEmpty(props.currentUser) ? "red" : "green";

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "15px",
        fontSize: "2em",
      }}
      onClick={() =>
        handleClickNewPlayerButton(props.currentUser, props.logout)
      }
    >
      <Button circular color={color} className="blue">
        {text}
      </Button>
    </div>
  );
};

export default connect(
  null,
  { logout },
)(UserButton);
