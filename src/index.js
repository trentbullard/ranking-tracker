import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import AuthProvider from "./contexts/AuthContext";
import FlashProvider from "./contexts/FlashContext";

const Root = () => {
  return (
    <FlashProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FlashProvider>
  );
};

ReactDOM.render(<Root />, document.querySelector("#root"));
