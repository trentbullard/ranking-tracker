import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";

export const log = (
  actionType,
  objectId,
  objectJson,
  message,
  objectType,
  currentUserId,
) => {
  tracker.post(
    "/logs",
    {
      actionType,
      objectType,
      objectId,
      objectJson: JSON.stringify(objectJson),
      currentUserId,
      message,
    },
    { params: { token: getDigest("post", "/logs") } },
  );
};
