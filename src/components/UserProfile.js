import React, { useState, useEffect } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";

const UserProfile = ({
  match: {
    params: { userId },
  },
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      const {
        data: [returnedUser],
      } = await tracker.get("/users", {
        params: {
          userId,
          token: getDigest("get", "/users"),
        },
      });
      const user = await returnedUser;
      setSelectedUser(user);
    };
    getUser(userId);
  }, [userId]);
  return (
    <h1 className="ui center aligned header">
      {selectedUser.firstName} {selectedUser.lastName}
    </h1>
  );
};

export default UserProfile;
