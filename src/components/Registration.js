import _ from "lodash";
import React from "react";
import RegistrationForm from "./forms/RegistrationForm";

class Registration extends React.Component {
  handleOnSubmit = value => {
    console.log(`TCL: submitted value`, value);
  };

  render() {
    return <RegistrationForm onSubmit={this.handleOnSubmit} />;
  }
}

export default Registration;
