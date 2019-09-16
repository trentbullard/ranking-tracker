import {
  USER_CREATED,
  USER_CREATION_REQUESTED,
  SET_SESSION,
  GET_USER,
} from "../actions/types";
import { encryptData } from "../helpers/aes";
import { getDigest } from "../helpers/hmac";
import tracker from "../apis/tracker";

export const createUser = formValues => async dispatch => {
  dispatch({ type: USER_CREATION_REQUESTED });
  const cipher = encryptData(formValues);
  const response = await tracker.post(
    "/users",
    {},
    {
      params: {
        cipher,
        token: getDigest("post", "/users"),
      },
    },
  );
  dispatch({ type: USER_CREATED, payload: response.data });
  dispatch({ type: GET_USER, payload: [response.data] });
  dispatch({ type: SET_SESSION, payload: response.data.sessionid });

  await tracker.post(
    "/logs",
    {
      actionType: USER_CREATED,
      objectType: "users",
      objectId: response.data.id,
      objectJson: JSON.stringify(response.data),
    },
    { params: { token: getDigest("post", "/logs") } },
  );
};
