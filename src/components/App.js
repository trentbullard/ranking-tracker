import _ from "lodash";
import React, { useContext, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import Header from "./Header";
import Home from "./Home";
import TwoOnTwoCreate from "./forms/TwoOnTwoCreate";
import ScoreKeeper from "./ScoreKeeper";
import GamesList from "./GamesList";
import PlayerList from "./PlayerList";
import PlayerCreate from "./forms/PlayerCreate";
import Login from "./Login";
import Registration from "./Registration";
import UserProfile from "./UserProfile";
import AnyUserRoute from "./routes/AnyUserRoute";
import UserProfileRoute from "./routes/UserProfileRoute";
import NotFound from "./NotFound";
import Flash from "./utility/Flash";
import { AppContext } from "../contexts/AppContext";

const App = () => {
  const appContext = useContext(AppContext);

  useEffect(() => {
    appContext.checkSession();
  }, []);

  return (
    <div className="ui container">
      <Router history={history}>
        <Header />
        <Flash />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/games" exact component={GamesList} />
          <Route path="/players" exact component={PlayerList} />
          <Route path="/players/new" exact component={PlayerCreate} />
          <AnyUserRoute path="/:sport/new" component={TwoOnTwoCreate} />
          <Route path="/games/score/:id" exact component={ScoreKeeper} />
          <UserProfileRoute path="/users/:id" exact component={UserProfile} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Registration} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
