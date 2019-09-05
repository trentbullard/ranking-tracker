import _ from "lodash-es";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import Dropdown from "./fields/Dropdown";

class TwoOnTwoForm extends Component {
  renderTextInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    if (Object.keys(this.props.selections).length === 4) {
      this.props.onSubmit(formValues);
    }
  };

  renderError = ({ error, touched }) => {
    if (touched && error) {
      return <div className="ui error mini message">{error}</div>;
    }
  };

  renderPlayerFields = sport => {
    return _.map(sport.teamNames.split(","), teamName =>
      _.map(sport.positionNames.split(","), positionName => (
        <div className="field" key={`${teamName}${positionName}`}>
          <label>{`${teamName} ${positionName}`}</label>
          <Field
            name={`${teamName.split(" ").join("")} ${positionName
              .split(" ")
              .join("")}`}
            label={`${teamName} ${positionName}`}
            component={Dropdown}
            options={this.props.players}
            selections={this.props.selections}
          />
        </div>
      )),
    );
  };

  getFormDisabled = () => {
    return Object.keys(this.props.selections).length === 4 ? "" : "disabled";
  };

  renderForm = () => {
    if (_.isEmpty(this.props.sport)) {
      return (
        <h4 className="ui center aligned header">
          This page is not accessible from there. Click{" "}
          <Link to="/">this link</Link> to return home.
        </h4>
      );
    } else if (this.props.players.length < 4) {
      return (
        <h4 className="ui center aligned header">
          There must be at least 4 players to start a game. You can reate a new
          player by clicking <Link to="/players/new">this link</Link>.
        </h4>
      );
    }
    return (
      <form
        className="ui form error"
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <Field
          name="started"
          label="Timestamp"
          input={{
            readOnly: true,
            value: this.props.timestamp.toLocaleString("en-US"),
          }}
          component={this.renderTextInput}
        />
        {this.renderPlayerFields(this.props.sport)}
        <button
          type="submit"
          className={`ui button positive ${this.getFormDisabled()}`}
        >
          Start
        </button>
        <button className={`ui button negative`} onClick={this.props.onCancel}>
          Cancel
        </button>
      </form>
    );
  };

  render() {
    return this.renderForm();
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.started) {
    errors.started = "There must be a timestamp";
  }
  if (!formValues.redKeeper) {
    errors.redKeeper = "You must select 4 players";
  }
  if (!formValues.redForward) {
    errors.redForward = "You must select 4 players";
  }
  if (!formValues.blueKeeper) {
    errors.blueKeeper = "You must select 4 players";
  }
  if (!formValues.blueForward) {
    errors.blueForward = "You must select 4 players";
  }
  return errors;
};

const mapStateToProps = ({ form: { twoOnTwoForm } }) => {
  return {
    selections: twoOnTwoForm
      ? _.reduce(
          twoOnTwoForm.values,
          (acc, value, key) => {
            if (!["started", "sport"].includes(key)) {
              return { ...acc, [key]: value };
            }
            return { ...acc };
          },
          {},
        )
      : {},
  };
};

TwoOnTwoForm = connect(
  mapStateToProps,
  null,
)(TwoOnTwoForm);

export default reduxForm({
  form: "twoOnTwoForm",
  validate,
  initialValues: { started: new Date().toISOString() },
})(TwoOnTwoForm);
