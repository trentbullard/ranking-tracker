import _ from "lodash";
import React, { useState } from "react";

export const FlashContext = React.createContext();

const FlashProvider = props => {
  const [flash, setFlash] = useState([]);

  const addFlash = message => {
    setFlash(_.concat(flash, message));
  };

  const removeFlash = indexRemoving => {
    const newList = _.clone(flash);
    _.remove(newList, (_value, index) => {
      return index === indexRemoving;
    });
    setFlash(newList);
  };

  const state = {
    flash,
    addFlash,
    removeFlash,
  };

  return (
    <FlashContext.Provider value={state}>
      {props.children}
    </FlashContext.Provider>
  );
};

export default FlashProvider;
