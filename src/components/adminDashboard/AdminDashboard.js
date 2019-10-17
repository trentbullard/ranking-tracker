import React from "react";
import { Tab } from "semantic-ui-react";
import UsersPane from "./usersPane/UsersPane";
import PlayersPane from "./PlayersPane";
import GamesPane from "./GamesPane";
import "../../styles/adminDashboard/adminDashboard.css";

const panes = [
  {
    menuItem: "users",
    render: () => <UsersPane />,
  },
  {
    menuItem: "players",
    render: () => <PlayersPane />,
  },
  {
    menuItem: "games",
    render: () => <GamesPane />,
  },
];

const AdminDashboard = props => {
  return (
    <>
      <h3 className="ui center aligned header">Admin Dashboard</h3>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </>
  );
};

export default AdminDashboard;
