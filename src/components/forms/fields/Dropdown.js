import _ from "lodash-es";
import React from "react";
import { Dropdown as SUIDropdown } from "semantic-ui-react";

const Dropdown = ({ label, options, input, selections }) => {
  let formattedOptions = _.map(
    _.filter(options, option => {
      if (
        selections[input.name] === option.id ||
        !Object.values(selections).includes(option.id)
      ) {
        return true;
      }
      return false;
    }),
    o => ({
      key: o.name,
      value: o.id,
      text: o.name,
    }),
  );

  return (
    <SUIDropdown
      {...input}
      onChange={(_param, data) => input.onChange(data.value)}
      onBlur={(_param, data) => input.onBlur(data.value)}
      value={input.value}
      placeholder={label}
      options={formattedOptions}
      fluid
      search
      selection
      clearable
      closeOnChange
      closeOnEscape
    />
  );
};

export default Dropdown;
