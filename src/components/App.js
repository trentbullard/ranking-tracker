import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "../history";
import AdminDashboard from "./AdminDashboard";
import Footer from "./Footer";
import GamesList from "./GamesList";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import NewGame from "./NewGame";
import NewPlayer from "./NewPlayer";
import NotFound from "./NotFound";
import PlayerList from "./PlayerList";
import Registration from "./Registration";
import AdminRoute from "./routes/AdminRoute";
import AnyUserRoute from "./routes/AnyUserRoute";
import UserProfileRoute from "./routes/UserProfileRoute";
import ScoreKeeper from "./ScoreKeeper";
import UserProfile from "./UserProfile";
import ErrorBoundary from "./utility/ErrorBoundary";
import Flash from "./utility/Flash";
import NoAuthRoute from "./routes/NoAuthRoute";

const App = () => {
  return (
    <div className="ui container">
      <Router history={history}>
        <Header />
        <Flash />
        <ErrorBoundary>
          <Switch>
            <Route path="/" exact component={Home} />
            <AdminRoute path="/admin" exact component={AdminDashboard} />
            <Route path="/games" exact component={GamesList} />
            <Route path="/players" exact component={PlayerList} />
            <AnyUserRoute path="/players/new" exact component={NewPlayer} />
            <NoAuthRoute path="/login" exact component={Login} />
            <NoAuthRoute path="/register" exact component={Registration} />
            <NoAuthRoute path="/users/new" exact component={Registration} />
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
            <AnyUserRoute path="/:sport/new" exact component={NewGame} />
            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
