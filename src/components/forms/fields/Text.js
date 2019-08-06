import React from "react";
import { Input } from "semantic-ui-react";

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return <div className="ui error mini message">{error}</div>;
  }
};

const Text = ({ input, label, meta, disabled }) => {
  const className = `field ${
    meta.error && meta.touched ? "error" : ""
  } ${disabled}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <Input placeholder={label} {...input} />
      {renderError(meta)}
    </div>
  );
};

export default Text;
