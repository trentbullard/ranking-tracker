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
            <AnyUserRoute path="/players/new" exact component={NewPlayer} />
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
