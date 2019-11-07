import _ from "lodash";
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
  // console.log(`TCL: availablePlayers`, availablePlayers);
  console.log(`TCL: rest.value`, rest.value);
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
