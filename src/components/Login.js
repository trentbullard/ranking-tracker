import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { List } from "semantic-ui-react";
import Cookies from "js-cookie";
import tracker from "../apis/tracker";
import { FlashContext } from "../contexts/FlashContext";
import { encryptData } from "../helpers/aes";
import { getDigest } from "../helpers/hmac";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = () => {
  const { setCurrentUser, setSessionId } = useContext(AuthContext);
  const { addFlash } = useContext(FlashContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async event => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const cipher = encryptData({ email, password });
    const {
      data: [returnedUser],
    } = await tracker.get("/auth", {
      params: {
        cipher,
        token: getDigest("get", "/auth"),
      },
    });
    if (!!returnedUser && !!returnedUser.error) {
      addFlash(returnedUser.message);
      return null;
    } else if (!returnedUser) {
      addFlash(`username or password incorrect`);
      return null;
    }
    setCurrentUser(returnedUser);
    const userId = returnedUser.id;
    const {
      data: { sessionId },
    } = await tracker.post(
      "/login",
      {
        userId,
      },
      {
        params: {
          token: getDigest("post", "/login"),
        },
      },
    );
    setSessionId(sessionId);
    Cookies.set("mrank-session-id", sessionId);
    addFlash("logged in successfully");
  };

  return (
    <form className="ui form" onSubmit={onSubmit}>
      <div className="field">
        <label>email</label>
        <input
          type="text"
          name="email"
          placeholder="email"
          value={email}
          onChange={({ currentTarget: { value } }) => setEmail(value)}
        />
      </div>
      <div className="field">
        <label>password</label>
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={({ currentTarget: { value } }) => setPassword(value)}
        />
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

const Login = _props => {
  const { currentUser, referrer } = useContext(AuthContext);
  if (!!currentUser) {
    return <Redirect to={referrer} />;
  }
  return (
    <>
      <h3 className="ui center aligned header">Login</h3>
      <LoginForm />
      <div className="ui hidden divider" style={{ margin: "2em 0" }} />
    </>
  );
};

export default Login;
