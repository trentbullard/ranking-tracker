import _ from "lodash";
import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import RegistrationForm from "./forms/RegistrationForm";
import { createUser } from "../actions/registrationActions";

class Registration extends React.Component {
  handleOnSubmit = event => {
    const formValues = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    this.props.createUser(formValues);
  };

  render() {
    if (
      _.isEmpty(this.props.userCreated) ||
      !_.isEmpty(this.props.userCreated.error) ||
      this.props.createUserRequested
    ) {
      return (
        <RegistrationForm
          onSubmit={this.handleOnSubmit}
          submitting={this.props.createUserRequested}
        />
      );
    }
    return <Redirect to="/" />;
  }
}

const mapStateToProps = ({
  registration: { createUserRequested, userCreated },
}) => ({
  createUserRequested,
  userCreated,
});

export default connect(
  mapStateToProps,
  { createUser },
)(Registration);
