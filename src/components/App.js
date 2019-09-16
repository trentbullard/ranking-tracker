import _ from "lodash";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import history from "../history";
import Header from "./Header";
import Home from "./Home";
import TwoOnTwoCreate from "./forms/TwoOnTwoCreate";
import ScoreKeeper from "./ScoreKeeper";
import GamesList from "./GamesList";
import PlayerList from "./PlayerList";
import PlayerCreate from "./forms/PlayerCreate";
import ErrorBoundary from "./utility/ErrorBoundary";
import Login from "./Login";
import { checkSession } from "../actions/loginActions";
import UserButton from "./UserButton";
import Registration from "./Registration";

class App extends React.Component {
  componentDidMount() {
    if (_.isEmpty(this.props.currentUser)) {
      this.props.checkSession();
    }
  }

  render() {
    return (
      <div className="ui container">
        <Router history={history}>
          <ErrorBoundary>
            <UserButton currentUser={this.props.currentUser} />
            <Header />
            <Switch>
              <Route path="/games" exact component={GamesList} />
              <Route path="/players" exact component={PlayerList} />
              <Route path="/players/new" exact component={PlayerCreate} />
              <Route path="/:sport/new" component={TwoOnTwoCreate} />
              <Route path="/games/score/:id" exact component={ScoreKeeper} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Registration} />
              <Route path="/" component={Home} />
            </Switch>
          </ErrorBoundary>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = ({ login: { currentUser } }) => {
  return {
    currentUser,
  };
};

export default connect(
  mapStateToProps,
  { checkSession },
)(App);
