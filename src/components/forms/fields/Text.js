import React from "react";
import { Form } from "semantic-ui-react";

const Text = ({ input, label, type, meta: { touched, error } }) => {
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

export default Text;
