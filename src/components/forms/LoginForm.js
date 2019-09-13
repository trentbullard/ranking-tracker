import React from "react";

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
      <button className="ui button" type="submit">
        Submit
      </button>
    </form>
  );
};
