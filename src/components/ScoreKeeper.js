import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getScoreKeeperData,
  scoreGoal,
  playAgain,
} from "../actions/scoreKeeperActions";
import PlayAgainButton from "./forms/buttons/PlayAgainButton";
import BackArrow from "./utility/BackArrow";
import history from "../history";

class ScoreKeeper extends Component {
  componentDidMount() {
    this.props.getScoreKeeperData(this.props.match.params.id);
  }

  renderLabels = (name, score, color, left) => {
    let buttonStyle = { maxWidth: "70%", minWidth: "70%" };
    let labelStyle = { maxWidth: "30%", minWidth: "30%" };
    if (left) {
      return [
        <div
          className={`ui ${color} basic left label`}
          style={labelStyle}
          key={`${color}-${name}-label`}
        >
          {score}
        </div>,
        <div
          className={`ui ${color} button`}
          style={buttonStyle}
          key={`${color}-${name}-button`}
        >
          {name}
        </div>,
      ];
    }
    return [
      <div
        className={`ui ${color} button`}
        style={buttonStyle}
        key={`${color}-${name}-button`}
      >
        {name}
      </div>,
      <div
        className={`ui ${color} basic label`}
        style={labelStyle}
        key={`${color}-${name}-label`}
      >
        {score}
      </div>,
    ];
  };

  renderScoreButtons = (team, teamIndex, disabled) => {
    let positions = Object.keys(team);
    let players = Object.values(team);
    let color = ["red", "blue"][teamIndex];
    let left = teamIndex ? "left" : "";
    return _.map(players, (player, index) => {
      return (
        <div
          className={`ui ${disabled} ${left} labeled button`}
          style={{ maxWidth: "100%", minWidth: "100%", margin: "0 0 2em" }}
          key={`${positions[index]}-${player.name}`}
          onClick={() => {
            this.props.scoreGoal(player, this.props.game).then(() => {
              this.setState({ update: true });
            });
          }}
        >
          {this.renderLabels(player.name, player.score, color, teamIndex)}
        </div>
      );
    });
  };

  renderTeamColumns = disabled => {
    return _.map(Object.values(this.props.game.teams), (team, index) => {
      let teamScore = _.reduce(
        Object.keys(team),
        (sum, position) => {
          return sum + team[position].score;
        },
        0,
      );
      return (
        <div className="column" key={`${index}-column`}>
          <h4 className="ui center aligned header">Score: {teamScore}</h4>
          {this.renderScoreButtons(team, index, disabled)}
        </div>
      );
    });
  };

  renderScoringInterface = () => {
    if (Object.keys(this.props.game).length) {
      let disabled = this.gameOver() ? "disabled" : "";
      return (
        <div className="ui center aligned grid" key="scoring-interface">
          <div className="center aligned two column row">
            {this.renderTeamColumns(disabled)}
          </div>
        </div>
      );
    }
    return <div key="game-not-found">Game not found or game has no teams</div>;
  };

  gameOver = () => {
    return _.map(Object.values(this.props.game.teams), team => {
      return (
        Object.values(team)[0].score + Object.values(team)[1].score >=
        this.props.sport.winningScore
      );
    }).some(winning => {
      return winning;
    });
  };

  renderPlayAgainButton = () => {
    if (Object.keys(this.props.game).length && this.gameOver()) {
      return (
        <PlayAgainButton
          onClick={() => {
            this.props.playAgain(this.props.game, this.props.players);
          }}
          key="play-again-button"
        />
      );
    }
  };

  onClickBackArrow = () => {
    history.push("/");
  };

  renderBackArrow = () => (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "15px",
        fontSize: "2em",
      }}
      onClick={this.onClickBackArrow}
      key="back-arrow"
    >
      <i className="arrow left blue icon" />
    </div>
  );

  render() {
    return [
      <h3
        className="ui center aligned header"
        style={{ margin: "2em" }}
        key="scorekeeper-header"
      >
        Score Keeper
      </h3>,
      this.renderScoringInterface(),
      this.renderPlayAgainButton(),
      <BackArrow url="/" key="back-arrow" />,
    ];
  }
}

const mapStateToProps = ({ scoreKeeper }, ownProps) => {
  let game = scoreKeeper.game[ownProps.match.params.id] || {};
  let sport = scoreKeeper.sport[game.sport] || {};
  let players = Object.values(scoreKeeper.players);
  let createdGame = scoreKeeper.createdGame || {};
  return {
    game,
    sport,
    players,
    createdGame,
  };
};

export default connect(
  mapStateToProps,
  {
    getScoreKeeperData,
    scoreGoal,
    playAgain,
  },
)(ScoreKeeper);
