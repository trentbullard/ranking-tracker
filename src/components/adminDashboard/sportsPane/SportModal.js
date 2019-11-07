import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Modal, Icon, Form, Button } from "semantic-ui-react";
import { SportContext } from "../../../contexts/SportContext";
import { FlashContext } from "../../../contexts/FlashContext";
import { AuthContext } from "../../../contexts/AuthContext";
import tracker from "../../../apis/tracker";
import { getDigest } from "../../../helpers/hmac";
import { log } from "../../../helpers/log";
import DeleteSportConfirmationModal from "./DeleteSportConfirmationModal";

const emptySport = {
  name: "",
  winningScore: "",
  teamNames: "",
  positionNames: "",
  enabled: false,
  playersPerTeam: "",
  iconName: "",
};

const SportModal = ({ sport, showModal, setShowModal }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formValues, setFormValues] = useState(emptySport);
  const [errors, setErrors] = useState({});

  const { setSportUpdated, setSportAdded } = useContext(SportContext);
  const { addFlash } = useContext(FlashContext);
  const { currentUser } = useContext(AuthContext);

  // set form values from sport
  useEffect(() => {
    setFormValues(sport || emptySport);
  }, [sport]);

  // set form validity
  useEffect(() => {
    const {
      name,
      winningScore,
      teamNames,
      positionNames,
      playersPerTeam,
      iconName,
    } = formValues;
    const tempErrors = {};

    if (_.isEmpty(name)) {
      tempErrors.name = { content: "required" };
    }

    if (_.isEmpty(winningScore)) {
      tempErrors.winningScore = { content: "required" };
    } else if (winningScore.toString().match(/[^0-9]/g)) {
      tempErrors.winningScore = { content: "must be an integer" };
    }

    if (_.isEmpty(teamNames)) {
      tempErrors.teamNames = { content: "required" };
    }

    if (_.isEmpty(positionNames)) {
      tempErrors.positionNames = { content: "required" };
    }

    if (_.isEmpty(playersPerTeam.toString())) {
      tempErrors.playersPerTeam = { content: "required" };
    } else if (playersPerTeam.toString().match(/[^0-9]/g)) {
      tempErrors.playersPerTeam = { content: "must be an integer" };
    } else if (
      !_.isEmpty(positionNames) &&
      positionNames.split(",").length !== parseInt(playersPerTeam)
    ) {
      tempErrors.positionNames = { content: "does not match players per team" };
      tempErrors.playersPerTeam = { content: "does not match position names" };
    }

    if (_.isEmpty(iconName)) {
      tempErrors.iconName = { content: "required" };
    }

    setErrors(tempErrors);
  }, [formValues]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!!sport) {
      try {
        const { data } = await tracker.patch(
          `/sports/${sport.id}`,
          formValues,
          {
            params: {
              token: getDigest("patch", "/sports/:id"),
            },
          },
        );
        const returnedSport = await data;
        setSportUpdated(returnedSport);
        log(
          "SPORT_UPDATED",
          sport.id,
          returnedSport,
          null,
          "sports",
          currentUser.id,
        );
        addFlash(`sport updated successfully`);
      } catch (error) {
        console.log("failed to update sport: ", error.stack);
        addFlash(`failed to update sport`);
      }
    } else {
      try {
        const { data } = await tracker.post(
          `/sports`,
          { ...formValues, startingElo: 100 },
          {
            params: {
              token: getDigest("post", "/sports"),
            },
          },
        );
        const returnedSport = await data;
        setSportAdded(returnedSport);
        log(
          "SPORT_CREATED",
          returnedSport.id,
          returnedSport,
          null,
          "sports",
          currentUser.id,
        );
        addFlash(`sport created successfully`);
      } catch (error) {
        console.log("failed to create sport: ", error.stack);
        addFlash(`failed to create sport`);
      }
    }
    setShowModal(false);
  };

  const ShowDelete = props => {
    if (!!sport) {
      return (
        <DeleteSportConfirmationModal
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
          setShowSportModal={setShowModal}
          sport={sport}
        />
      );
    }
    return null;
  };

  return (
    <Modal
      trigger={null}
      open={!!showModal}
      onClose={() => setShowModal(false)}
      basic
    >
      <Modal.Header>
        <Icon.Group size="big">
          <Icon name="trophy" />
          <Icon corner color="black" name={!!sport ? "pencil" : "add"} />
        </Icon.Group>{" "}
        {!!sport ? "Edit" : "Create"} Sport
      </Modal.Header>
      <Modal.Content>
        <Form inverted error>
          <Form.Input
            error={errors.name}
            label="name"
            placeholder="name..."
            value={formValues.name || ""}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, name: value };
              })
            }
          />
          <Form.Input
            error={errors.winningScore}
            label="winningScore"
            placeholder="winning score..."
            value={formValues.winningScore || ""}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, winningScore: value };
              })
            }
          />
          <Form.Input
            error={errors.teamNames}
            label="teamNames"
            placeholder="team names..."
            value={formValues.teamNames.replace(",", ", ") || ""}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, teamNames: value.replace(", ", ",") };
              })
            }
          />
          <Form.Input
            error={errors.positionNames}
            label="positionNames"
            placeholder="position names..."
            value={formValues.positionNames.replace(",", ", ") || ""}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, positionNames: value.replace(", ", ",") };
              })
            }
          />
          <Form.Checkbox
            label="enabled"
            checked={formValues.enabled}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, enabled: value };
              })
            }
          />
          <Form.Input
            error={errors.playersPerTeam}
            label="playersPerTeam"
            placeholder="players per team..."
            value={formValues.playersPerTeam || ""}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, playersPerTeam: value };
              })
            }
          />
          <Form.Input
            error={errors.iconName}
            label="iconName"
            placeholder="icon name..."
            value={formValues.iconName || ""}
            onChange={(_event, { value }) =>
              setFormValues(fv => {
                return { ...fv, iconName: value };
              })
            }
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          id="submit-btn"
          content="Submit"
          color="green"
          onClick={handleSubmit}
          disabled={!_.isEmpty(errors)}
        />
        <Button
          content="Cancel"
          secondary
          onClick={() => setShowModal(false)}
        />
        <ShowDelete />
      </Modal.Actions>
    </Modal>
  );
};

export default SportModal;
