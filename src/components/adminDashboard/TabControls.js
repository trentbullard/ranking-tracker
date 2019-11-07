import React from "react";
import { Input, Button } from "semantic-ui-react";

const TabControls = ({ modalProps, buttonIcon }) => {
  const handleClickButton = event => {
    event.preventDefault();
    modalProps.onClickButton(null);
    modalProps.setShowModal(true);
  };

  return (
    <div className="flex-container">
      <div className="tab pane menu button">
        <Button
          className="green"
          icon={buttonIcon || "add"}
          circular
          onClick={handleClickButton}
        />
      </div>
      <div className="tab pane menu divider" />
      <div className="tab pane menu search">
        <Input fluid icon="search" placeholder="Search..." />
      </div>
    </div>
  );
};

export default TabControls;
