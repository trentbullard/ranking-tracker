import _ from "lodash";
import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import LoginForm from "./forms/LoginForm";
import { getUser, checkSession } from "../actions/loginActions";

class Login extends React.Component {
  componentDidMount() {
    this.props.checkSession();
  }

  onSubmit = event => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    this.props.getUser(email, password);
  };

  render() {
    if (!_.isEmpty(this.props.currentUser)) {
      return <Redirect to="/" />;
    }
    return [
      <h3 className="ui center aligned header" key="login-header">
        Login
      </h3>,
      <LoginForm onSubmit={this.onSubmit} key="login-form" />,
    ];
  }
}

const mapStateToProps = ({ login: { currentUser } }) => {
  return {
    currentUser,
  };
};

export default connect(
  mapStateToProps,
  { getUser, checkSession },
)(Login);
