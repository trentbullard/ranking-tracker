import React from "react";
import { Form, Dropdown } from "semantic-ui-react";

const PlayerSelect = ({
  name,
  label,
  team,
  position,
  availablePlayers,
  setSelectedValues,
  ...rest
}) => {
  return (
    <Form.Field
      {...rest}
      value={rest.value}
      name={name || label}
      label={label}
      placeholder="Select Player"
      options={availablePlayers}
      search
      selection
      control={Dropdown}
      onChange={(_event, { value }) => {
        setSelectedValues(sv => {
          return {
            ...sv,
            [team]: {
              ...sv[team],
              [position || "Player"]: value,
            },
          };
        });
      }}
      clearable
      key={`field-${team}-${position}`}
    />
  );
};

export default PlayerSelect;
