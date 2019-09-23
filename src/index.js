import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import App from "./components/App";
import reducers from "./reducers";
import AuthProvider from "./contexts/AuthContext";
import FlashProvider from "./contexts/FlashContext";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const Root = () => {
  return (
    <Provider store={store}>
      <FlashProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FlashProvider>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.querySelector("#root"));
