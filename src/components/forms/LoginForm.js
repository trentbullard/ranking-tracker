import React from "react";
import { Link } from "react-router-dom";
import { List } from "semantic-ui-react";
import { AppContext } from "../../contexts/AppContext";

export default () => (
  <AppContext.Consumer>
    {context => (
      <form className="ui form" onSubmit={context.submitLogin}>
        <div className="field">
          <label>email</label>
          <input type="text" name="email" placeholder="email" />
        </div>
        <div className="field">
          <label>password</label>
          <input type="password" name="password" placeholder="password" />
        </div>
        <List horizontal>
          <List.Item>
            <button className="ui button" type="submit">
              Submit
            </button>
          </List.Item>
          <List.Item>
            <Link to="/register">Register</Link>
          </List.Item>
        </List>
      </form>
    )}
  </AppContext.Consumer>
);
