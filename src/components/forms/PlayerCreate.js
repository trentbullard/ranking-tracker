import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import history from "../../history";
import {
  getCreatePlayerFormData,
  createPlayer,
} from "../../actions/createPlayerActions";
import Text from "./fields/Text";
import Footer from "../Footer";

class PlayerCreate extends Component {
  componentDidMount() {
    this.props.getCreatePlayerFormData();
  }

  onSubmit = formValues => {
    this.props.createPlayer({ ...formValues, elo: 100 });
  };

  onCancel = () => {
    history.push("/");
  };

  fieldDisabled = () => {
    return this.props.errors ? "disabled" : "";
  };

  nameTaken = name => {
    return this.props.playerNames.includes(name) ? "Name taken!" : undefined;
  };

  renderFields = () => {
    return (
      <div className="field">
        <Field
          name="name"
          label="Name"
          component={Text}
          validate={this.nameTaken}
        />
      </div>
    );
  };

  renderForm = () => {
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
        className="ui form error"
        key="player-form"
      >
        <Field
          name="created"
          label="Created At"
          input={{
            readOnly: true,
            value: new Date().toLocaleString("en-US"),
          }}
          component={Text}
        />
        {this.renderFields()}
        <button
          type="submit"
          className={`ui button positive ${this.fieldDisabled()}`}
        >
          Create
        </button>
        <button className={`ui button negative`} onClick={this.onCancel}>
          Cancel
        </button>
      </form>
    );
  };

  render() {
    return [
      <h3 className="ui center aligned header" key="player-form-header">
        Create a player
      </h3>,
      this.renderForm(),
      <Footer key="footer" />,
    ];
  }
}

const mapStateToProps = ({
  form: {
    playerForm: { syncErrors },
  },
  createPlayer: { playerNames },
}) => {
  return {
    errors: syncErrors,
    playerNames,
  };
};

const validate = formValues => {
  const errors = {};
  if (!formValues.name) {
    errors.name = "User must have a name!";
  }
  return errors;
};

PlayerCreate = connect(
  mapStateToProps,
  { getCreatePlayerFormData, createPlayer },
)(PlayerCreate);

export default reduxForm({
  form: "playerForm",
  validate,
  initialValues: { created: new Date().toISOString() },
})(PlayerCreate);
