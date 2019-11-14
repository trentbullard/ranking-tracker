import React from "react";
import { Form } from "semantic-ui-react";

const AdminCheckbox = ({ user, checked, setFormValues }) => {
  if (user.isAdmin) {
    return (
      <Form.Checkbox
        label="admin"
        checked={checked}
        onChange={(_event, { checked }) => {
          setFormValues(fv => {
            return { ...fv, isAdmin: checked };
          });
        }}
      />
    );
  }
  return null;
};

export default AdminCheckbox;
