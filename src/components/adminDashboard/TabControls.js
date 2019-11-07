import React from "react";
import { Button, Input } from "semantic-ui-react";

const TabControls = ({ ButtonWrapper, buttonWrapperProps, buttonIcon }) => {
  return (
    <div className="flex-container">
      <div className="tab pane menu button">
        <ButtonWrapper {...buttonWrapperProps}>
          <Button className="green" icon={buttonIcon || "add"} circular />
        </ButtonWrapper>
      </div>
      <div className="tab pane menu divider" />
      <div className="tab pane menu search">
        <Input fluid icon="search" placeholder="Search..." />
      </div>
    </div>
  );
};

export default TabControls;
