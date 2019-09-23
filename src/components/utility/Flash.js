import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
import { CSSTransition } from "react-transition-group";
import { FlashContext } from "../../contexts/FlashContext";
import "../../styles/flash.css";

const Dismissable = props => {
  const { removeFlash } = useContext(FlashContext);
  const [inProp, setInProp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInProp(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = index => {
    removeFlash(index);
  };

  return (
    <CSSTransition
      in={inProp}
      timeout={250}
      classNames="flash"
      unmountOnExit
      onExited={() => dismiss(props.index)}
    >
      <Message {...props} onDismiss={() => setInProp(false)} />
    </CSSTransition>
  );
};

const Flash = _props => {
  const { flash } = useContext(FlashContext);

  return _.map(flash, (value, index) => {
    return <Dismissable content={value} index={index} key={`flash-${index}`} />;
  });
};

export default Flash;
