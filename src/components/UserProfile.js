import React, { useState, useEffect } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import BackArrow from "./utility/BackArrow";

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
      } = await tracker.get(`/users/${userId}`, {
        params: {
          userId,
          token: getDigest("get", "/users/:id"),
        },
      });
      const user = await returnedUser;
      setSelectedUser(user);
    };
    getUser(userId);
  }, [userId]);
  return (
    <>
      <h1 className="ui center aligned header">
        {selectedUser.firstName} {selectedUser.lastName}
      </h1>
      <BackArrow url="/" key="back-arrow" />
    </>
  );
};

export default UserProfile;
