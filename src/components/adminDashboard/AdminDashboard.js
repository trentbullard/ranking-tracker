import React from "react";
import { Tab } from "semantic-ui-react";
import UsersPane from "./usersPane/UsersPane";
import PlayersPane from "./playersPane/PlayersPane";
import GamesPane from "./gamesPane/GamesPane";
import "../../styles/adminDashboard/adminDashboard.css";
import SportProvider from "../../contexts/SportContext";

const panes = currentUser => {
  return [
    {
      menuItem: "users",
      render: () => <UsersPane currentUser={currentUser} />,
    },
    {
      menuItem: "players",
      render: () => (
        <SportProvider>
          <PlayersPane currentUser={currentUser} />
        </SportProvider>
      ),
    },
    {
      menuItem: "games",
      render: () => <GamesPane currentUser={currentUser} />,
    },
  ];
};

const AdminDashboard = ({ currentUser }) => {
  return (
    <>
      <h3 className="ui center aligned header">Admin Dashboard</h3>
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={panes(currentUser)}
      />
    </>
  );
};

export default AdminDashboard;
