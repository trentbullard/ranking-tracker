import _ from "lodash-es";
import history from "../history";
import {
  PLAYER_CREATED,
  PLAYERS_RETURNED,
  PLAYERS_REQUESTED,
  PLAYER_CREATION_REQUESTED,
} from "./types";
import tracker from "../apis/tracker";

export const getCreatePlayerFormData = () => async dispatch => {
  dispatch({ type: PLAYERS_REQUESTED });
  const playersResponse = await tracker.get("/players");
  dispatch({ type: PLAYERS_RETURNED, payload: playersResponse.data });
};

export const createPlayer = formValues => async dispatch => {
  dispatch({ type: PLAYER_CREATION_REQUESTED });
  const sportsResponse = await tracker.get("/sports");
  let sports = _.map(sportsResponse.data, sport => {
    return { id: sport.id };
  });
  const playerResonse = await tracker.post("/players", {
    name: formValues.name,
    sports,
    elo: 100,
  });
  dispatch({ type: PLAYER_CREATED, payload: playerResonse.data });
  history.push("/");
  // let { id, ...logValues } = playerResonse.data;
  // await tracker.post("/logs", { ...logValues, action: "create player" });
};
