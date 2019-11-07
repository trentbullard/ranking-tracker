import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const Loading = ({ dim, caption }) => {
  const text = caption ? "Loading" : null;
  if (dim) {
    return (
      <Dimmer active inverted>
        <Loader>{text}</Loader>
      </Dimmer>
    );
  } else {
    return <Loader active inline>{text}</Loader>;
  }
};

export default Loading;
