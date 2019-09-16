import React from "react";
import { Link } from "react-router-dom";
import { List } from "semantic-ui-react";

export default props => {
  return (
    <form className="ui form" onSubmit={props.onSubmit}>
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
  );
};
