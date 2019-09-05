import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getScoreKeeperData,
  scoreGoal,
  updateElos,
  playAgain,
} from "../actions/scoreKeeperActions";
import PlayAgainButton from "./forms/buttons/PlayAgainButton";
import BackArrow from "./utility/BackArrow";

class ScoreKeeper extends Component {
  componentDidMount() {
    this.props.getScoreKeeperData(this.props.match.params.id).then(() => {
      this.setState({ update: true });
    });
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

  renderScoreButtons = (team, teamIndex) => {
    let disabled = this.gameOver() || this.props.loading ? "disabled" : "";
    let positions = team.positions;
    let color = ["red", "blue", "green", "orange"][teamIndex];
    let left = teamIndex ? "left" : "";
    return _.map(positions, position => {
      return (
        <div
          className={`ui ${disabled} ${left} labeled button`}
          style={{ maxWidth: "100%", minWidth: "100%", margin: "0 0 2em" }}
          key={`${team.name}-${position.name}`}
          onClick={() => {
            this.props
              .scoreGoal(
                position.player.teamPlayerId,
                position.player.score + 1,
              )
              .then(() => {
                this.props
                  .getScoreKeeperData(this.props.match.params.id)
                  .then(() => {
                    if (this.gameOver()) {
                      this.props.updateElos(
                        this.props.sport,
                        this.props.game.teams,
                      );
                    }
                    this.setState({ update: true });
                  });
              });
          }}
        >
          {this.renderLabels(
            position.player.name,
            position.player.score,
            color,
            teamIndex,
          )}
        </div>
      );
    });
  };

  renderTeamColumns = () => {
    return _.map(this.props.game.teams, (team, index) => {
      let teamScore = _.reduce(
        team.positions,
        (sum, position) => {
          return sum + position.player.score;
        },
        0,
      );
      return (
        <div className="column" key={`${index}-column`}>
          <h4 className="ui center aligned header">Score: {teamScore}</h4>
          {this.renderScoreButtons(team, index)}
        </div>
      );
    });
  };

  renderScoringInterface = () => {
    if (!_.isEmpty(this.props.game)) {
      return (
        <div className="ui center aligned grid" key="scoring-interface">
          <div className="center aligned two column row">
            {this.renderTeamColumns()}
          </div>
        </div>
      );
    }
    return (
      <h4 className="ui center aligned header" key="game-not-found">
        Game not found or game has no teams
      </h4>
    );
  };

  gameOver = () => {
    return _.map(this.props.game.teams, team => {
      return (
        team.positions[0].player.score + team.positions[1].player.score >=
        this.props.sport.winningScore
      );
    }).some(winning => {
      return winning;
    });
  };

  renderPlayAgainButton = () => {
    if (!_.isEmpty(this.props.game) && this.gameOver()) {
      return (
        <PlayAgainButton
          onClick={() => {
            this.props.playAgain(this.props.game);
          }}
          key="play-again-button"
        />
      );
    }
  };

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

const mapStateToProps = ({
  scoreKeeper: { game, sport, players, loading },
}) => {
  return {
    loading,
    game,
    sport,
    players,
  };
};

export default connect(
  mapStateToProps,
  {
    getScoreKeeperData,
    scoreGoal,
    playAgain,
    updateElos,
  },
)(ScoreKeeper);
