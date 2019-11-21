import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import "../../styles/utility/loading.css";

const Loading = ({ dim, caption }) => {
  const text = caption ? "Loading" : null;
  if (dim) {
    return (
      <Dimmer active inverted>
        <Loader>{text}</Loader>
      </Dimmer>
    );
  } else {
    return (
      <div className="inline-loader">
        <Loader active inline>
          {text}
        </Loader>
      </div>
    );
  }
};

export default Loading;
