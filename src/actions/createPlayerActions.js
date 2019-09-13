import _ from "lodash-es";
import history from "../history";
import {
  PLAYER_CREATED,
  PLAYERS_RETURNED,
  PLAYERS_REQUESTED,
  PLAYER_CREATION_REQUESTED,
} from "./types";
import { getDigest } from "../helpers/hmac";
import tracker from "../apis/tracker";

export const getCreatePlayerFormData = () => async dispatch => {
  dispatch({ type: PLAYERS_REQUESTED });
  const playersResponse = await tracker.get("/players", {
    params: { token: getDigest("get", "/players") },
  });
  dispatch({ type: PLAYERS_RETURNED, payload: playersResponse.data });
};

export const createPlayer = formValues => async dispatch => {
  dispatch({ type: PLAYER_CREATION_REQUESTED });
  const sportsResponse = await tracker.get("/sports", {
    params: { token: getDigest("get", "/sports") },
  });
  let sports = _.map(sportsResponse.data, sport => {
    return { id: sport.id };
  });
  const playerResponse = await tracker.post(
    "/players",
    {
      name: formValues.name,
      sports,
      elo: 100,
    },
    {
      params: {
        token: getDigest("post", "/players"),
      },
    },
  );
  dispatch({ type: PLAYER_CREATED, payload: playerResponse.data });
  await tracker.post(
    "/logs",
    {
      actionType: PLAYER_CREATED,
      objectType: "players",
      objectId: playerResponse.data.id,
      objectJson: JSON.stringify(playerResponse.data),
    },
    { params: { token: getDigest("post", "/logs") } },
  );
  history.push("/");
};
