import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Modal, Icon, Form, Button } from "semantic-ui-react";
// import { FlashContext } from "../../../contexts/FlashContext";
// import { AuthContext } from "../../../contexts/AuthContext";
import { SportContext } from "../../../contexts/SportContext";
import { icons } from "../../../img/icons";
import DeleteGameConfirmationModal from "./DeleteGameConfirmationModal";

const emptyGame = {
  id: 0,
  sport: null,
  eloAwarded: false,
  teams: [],
  started: new Date(),
};

const EloAwardedCheckbox = ({ game, setFormValues }) => {
  if (!game) {
    return null;
  }
  return (
    <Form.Checkbox
      label="elo awarded"
      checked={game.eloAwarded}
      onChange={(_event, { checked }) => {
        setFormValues(fv => {
          return { ...fv, eloAwarded: checked };
        });
      }}
    />
  );
};

const GameModal = ({ game, showModal, setShowModal }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formValues, setFormValues] = useState(emptyGame);
  // const [errors, setErrors] = useState({});
  const [sportOptions, setSportOptions] = useState([]);

  // const { addFlash } = useContext(FlashContext);
  // const { currentUser } = useContext(AuthContext);
  const { sports } = useContext(SportContext);

  // set form values from game
  useEffect(() => {
    if (!game) {
      const id = setInterval(
        () =>
          setFormValues(fv => {
            return { ...fv, started: new Date() };
          }),
        1000,
      );
      return () => clearInterval(id);
    } else {
      setFormValues(game);
    }
  }, [game]);

  // clear values on modal close
  useEffect(() => {
    if (!showModal) {
      setFormValues(emptyGame);
    }
  }, [showModal]);

  // set sport options
  useEffect(() => {
    setSportOptions(
      _.map(sports, sport => {
        return {
          key: sport.id,
          text: sport.name,
          value: sport.id,
          image: { avatar: true, src: icons()[sport.iconName] },
        };
      }),
    );
  }, [sports]);

  const handleSubmit = event => {
    event.preventDefault();
    console.log("formValues:", formValues);
  };

  const ShowDelete = props => {
    if (!!game) {
      return (
        <DeleteGameConfirmationModal
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
          setShowGameModal={setShowModal}
          game={game}
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
          <Icon name="futbol" />
          <Icon corner color="black" name={!!game ? "pencil" : "add"} />
        </Icon.Group>{" "}
        {!!game ? "Edit" : "Create"} Game
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} inverted error>
          <Form.Input
            label="created at"
            value={new Date(formValues.started).toLocaleString("en-us")}
            readOnly
          />
          <Form.Dropdown
            labeled
            basic
            placeholder="select a sport"
            options={sportOptions}
            value={formValues.sport}
            onChange={(event, { value }) => {
              setFormValues(fv => {
                return { ...fv, sport: value };
              });
            }}
          />
          <EloAwardedCheckbox game={game} setFormValues={setFormValues} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          id="submit-btn"
          content="Submit"
          color="green"
          onClick={handleSubmit}
          // disabled={!_.isEmpty(errors)}
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

export default GameModal;
