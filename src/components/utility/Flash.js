import _ from "lodash";
import React from "react";
import { Message } from "semantic-ui-react";
import { AppContext } from "../../contexts/AppContext";

export default props => {
  return (
    <AppContext.Consumer>
      {context => {
        return _.map(context.flash, (value, index) => {
          return (
            <Message
              content={value}
              onDismiss={context.clearFlash}
              key={`flash-${index}`}
            />
          );
        });
      }}
    </AppContext.Consumer>
  );
};
