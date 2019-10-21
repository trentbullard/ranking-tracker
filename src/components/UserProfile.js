import _ from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";
import BackArrow from "./utility/BackArrow";
import { AuthContext } from "../contexts/AuthContext";

const UserProfile = ({
  match: {
    params: { userId },
  },
}) => {
  const { currentUser } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const ProfileTitle = () => {
    if (selectedUser) {
      return `${selectedUser.firstName} ${selectedUser.lastName}`;
    }
    return `User ${userId}`;
  };

  const AdminButton = () => {
    const loggedIn = !!currentUser;
    if (!loggedIn) {
      return null;
    }

    const isAdmin = currentUser.isAdmin;
    if (!isAdmin) {
      return null;
    }

    const foundSelectedUser = !!selectedUser;
    if (!foundSelectedUser) {
      return null;
    }

    const selectedSelf = _.isEqualWith(currentUser, selectedUser, (a, b) => {
      return a.id === b.id;
    });
    if (!selectedSelf) {
      return null;
    }

    return (
      <Header.Subheader>
        <Link to="/admin">(admin)</Link>
      </Header.Subheader>
    );
  };

  return (
    <>
      <Header as="h1" textAlign="center">
        <Header.Content>
          <ProfileTitle />
          <AdminButton />
        </Header.Content>
      </Header>
      <BackArrow url="/" key="back-arrow" />
    </>
  );
};

export default UserProfile;
