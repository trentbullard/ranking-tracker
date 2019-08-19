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
  const response = await tracker.get("/players");
  dispatch({ type: PLAYERS_RETURNED, payload: response.data });
};

export const createPlayer = formValues => async dispatch => {
  let { created, ...playerValues } = formValues;
  dispatch({ type: PLAYER_CREATION_REQUESTED });
  const response = await tracker.post("/players", playerValues);
  dispatch({ type: PLAYER_CREATED, payload: response.data });
  history.push("/");
  let { id, ...logValues } = response.data;
  await tracker.post("/logs", { ...logValues, action: "create player" });
};
