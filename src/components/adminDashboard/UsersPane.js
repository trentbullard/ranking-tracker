import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Tab, Table } from "semantic-ui-react";
import tracker from "../../apis/tracker";
import { getDigest } from "../../helpers/hmac";

const UserRows = ({ users, sorted: { column, order } }) => {
  return _.map(_.orderBy(users, [column], [order]), (user, index) => {
    return (
      <Table.Row key={`user-row-${index}`}>
        <Table.Cell>{user.id}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.isAdmin.toString()}</Table.Cell>
      </Table.Row>
    );
  });
};

const UsersPane = props => {
  const [users, setUsers] = useState([]);
  const [term, setTerm] = useState("");
  const [sorted, setSorted] = useState({ column: "id", order: "ascending" });

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await tracker.get("/users", {
        params: {
          token: getDigest("get", "/users"),
        },
      });
      const returnedUsers = await data;
      setUsers(returnedUsers);
    };
    getUsers();
  }, []);

  useEffect(() => {});

  const handleClickHeader = event => {
    setSorted({ column: event.currentTarget.value, order: "ascending" });
  };

  return (
    <Tab.Pane attached={false}>
      <div className="ui fluid icon input disabled">
        <input type="text" placeholder="Search..." />
        <i aria-hidden="true" className="search icon" />
      </div>
      <Table unstackable celled striped id="usersTable">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="ui link" onClick={handleClickHeader}>
              id
            </Table.HeaderCell>
            <Table.HeaderCell className="ui link" onClick={handleClickHeader}>
              username
            </Table.HeaderCell>
            <Table.HeaderCell className="ui link" onClick={handleClickHeader}>
              is admin?
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <UserRows users={users} sorted={sorted} />
        </Table.Body>
      </Table>
    </Tab.Pane>
  );
};

export default UsersPane;
