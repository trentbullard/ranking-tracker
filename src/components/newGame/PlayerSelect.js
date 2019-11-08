import _ from "lodash";
import React from "react";
import { Form, Dropdown } from "semantic-ui-react";

let ctr = 1;

const PlayerSelect = ({
  name,
  label,
  team,
  position,
  availablePlayers,
  setSelectedValues,
  value,
  ...rest
}) => {
  const updatedPlayers = _.map(availablePlayers, value => {
    return {
      ...value,
      key: value.text + ctr++,
    };
  });
  return (
    <Form.Input
      {...rest}
      value={value}
      name={name || label}
      label={label}
      placeholder="Select Player"
      options={updatedPlayers}
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
    />
  );
};

export default PlayerSelect;
