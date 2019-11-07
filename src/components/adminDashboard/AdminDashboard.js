import React from "react";
import { Tab } from "semantic-ui-react";
import UsersPane from "./usersPane/UsersPane";
import PlayersPane from "./playersPane/PlayersPane";
import GamesPane from "./gamesPane/GamesPane";
import "../../styles/adminDashboard/adminDashboard.css";
import SportProvider from "../../contexts/SportContext";
import BackArrow from "../utility/BackArrow";
import SportsPane from "./sportsPane/SportsPane";

const panes = currentUser => {
  return [
    {
      menuItem: "users",
      render: () => <UsersPane currentUser={currentUser} />,
    },
    {
      menuItem: "players",
      render: () => <PlayersPane currentUser={currentUser} />,
    },
    {
      menuItem: "games",
      render: () => <GamesPane currentUser={currentUser} />,
    },
    {
      menuItem: "sports",
      render: () => <SportsPane currentUser={currentUser} />,
    },
  ];
};

const AdminDashboard = ({ currentUser }) => {
  return (
    <>
      <h3 className="ui center aligned header">Admin Dashboard</h3>
      <SportProvider>
        <Tab
          menu={{ secondary: true, pointing: true }}
          panes={panes(currentUser)}
        />
      </SportProvider>
      <BackArrow url={`/users/${currentUser.id}`} />
    </>
  );
};

export default AdminDashboard;
