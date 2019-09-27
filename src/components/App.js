import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import AnyUserRoute from "./routes/AnyUserRoute";
import UserProfileRoute from "./routes/UserProfileRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./AdminDashboard";
import Header from "./Header";
import Home from "./Home";
import ScoreKeeper from "./ScoreKeeper";
import GamesList from "./GamesList";
import PlayerList from "./PlayerList";
import PlayerCreate from "./forms/PlayerCreate";
import Login from "./Login";
import Registration from "./Registration";
import UserProfile from "./UserProfile";
import NotFound from "./NotFound";
import Flash from "./utility/Flash";
import Footer from "./Footer";
import NewGame from "./NewGame";
import ErrorBoundary from "./utility/ErrorBoundary";

const App = () => {
  return (
    <div className="ui container">
      <Router history={history}>
        <Header />
        <Flash />
        <ErrorBoundary>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/games" exact component={GamesList} />
            <Route path="/players" exact component={PlayerList} />
            <AnyUserRoute path="/players/new" exact component={PlayerCreate} />
            <AnyUserRoute path="/:sport/new" component={NewGame} />
            <AnyUserRoute
              path="/games/score/:id"
              exact
              component={ScoreKeeper}
            />
            <UserProfileRoute
              path="/users/:userId"
              exact
              component={UserProfile}
            />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Registration} />
            <AdminRoute path="/admin" exact component={AdminDashboard} />
            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
