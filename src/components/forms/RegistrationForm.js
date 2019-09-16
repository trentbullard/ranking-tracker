import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Button, Form } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";

class RegistrationForm extends React.Component {
  renderField = ({ input, label, type, meta: { touched, error } }) => {
    return (
      <Form.Input
        {...input}
        error={touched && (error && { content: error })}
        label={label}
        placeholder={label}
        type={type}
      />
    );
  };

  render() {
    return (
      <Form onSubmit={this.props.onSubmit}>
        <Field
          name="email"
          component={this.renderField}
          type="text"
          label="email"
        />
        <Field
          name="password"
          component={this.renderField}
          type="password"
          label="password"
        />
        <Field
          name="passwordConfirmation"
          component={this.renderField}
          type="password"
          label="password confirmation"
        />
        <Button disabled={!_.isEmpty(this.props.syncErrors)}>Submit</Button>
      </Form>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.email) {
    errors.email = "Required";
  }
  if (!formValues.password) {
    errors.password = "Required";
  }
  if (!formValues.passwordConfirmation) {
    errors.passwordConfirmation = "Required";
  }
  if (formValues.password !== formValues.passwordConfirmation) {
    errors.passwordConfirmation = "password doesn't match confirmation";
  }
  return errors;
};

const mapStateToProps = ({
  form: {
    registrationForm: { syncErrors },
  },
}) => {
  return { syncErrors };
};

RegistrationForm = connect(
  mapStateToProps,
  null,
)(RegistrationForm);

export default reduxForm({
  form: "registrationForm",
  validate,
})(RegistrationForm);
