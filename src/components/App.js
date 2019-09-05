import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import Header from "./Header";
import Home from "./Home";
import TwoOnTwoCreate from "./forms/TwoOnTwoCreate";
import ScoreKeeper from "./ScoreKeeper";
import GamesList from "./GamesList";
import PlayerList from "./PlayerList";
import PlayerCreate from "./forms/PlayerCreate";
import ErrorBoundary from "./utility/ErrorBoundary";

const App = props => (
  <div className="ui container">
    <Router history={history}>
      <Header />
      <ErrorBoundary>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/games" exact component={GamesList} />
          <Route path="/players" exact component={PlayerList} />
          <Route path="/players/new" exact component={PlayerCreate} />
          <Route path="/:sport/new" component={TwoOnTwoCreate} />
          <Route path="/games/score/:id" component={ScoreKeeper} />
        </Switch>
      </ErrorBoundary>
    </Router>
  </div>
);

export default App;
