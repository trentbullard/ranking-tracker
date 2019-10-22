import React from "react";
import { Icon } from "semantic-ui-react";

const SortIcon = ({ sorted, header }) => {
  if (sorted.column === header) {
    if (sorted.order === "asc") {
      return <Icon name="caret up"></Icon>;
    }
    return <Icon name="caret down"></Icon>;
  }
  return null;
};

export default SortIcon;
