import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Tab, Table, Button } from "semantic-ui-react";
import tracker from "../../apis/tracker";
import { getDigest } from "../../helpers/hmac";

const fieldMap = {
  id: "id",
  username: "email",
  "is admin?": "isAdmin",
};

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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [term, setTerm] = useState("");
  const [sorted, setSorted] = useState({ column: "id", order: "asc" });

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await tracker.get("/users", {
        params: {
          token: getDigest("get", "/users"),
        },
      });
      const returnedUsers = await data;
      setUsers(returnedUsers);
      setFilteredUsers(returnedUsers);
    };
    getUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      _.filter(users, user => {
        return (
          user.id.toString().includes(term) ||
          user.email.includes(term) ||
          user.isAdmin.toString().includes(term)
        );
      }),
    );
  }, [term, users]);

  useEffect(() => {
    const { column, order } = sorted;
    setFilteredUsers(fuArr => _.orderBy(fuArr, [column], [order]));
  }, [sorted]);

  const handleSearch = event => {
    event.preventDefault();
    setTerm(event.currentTarget.value);
  };

  const handleClickHeader = event => {
    event.preventDefault();
    const field = fieldMap[event.currentTarget.innerText];
    if (sorted.column === field) {
      if (sorted.order === "asc") {
        setSorted({ column: field, order: "desc" });
      } else {
        setSorted({ column: field, order: "asc" });
      }
    } else {
      setSorted({ column: field, order: "asc" });
    }
  };

  return (
    <Tab.Pane attached={false}>
      <div className="flex-container">
        <div className="tab pane menu button">
          <Button className="green" circular icon="add user" />
        </div>
        <div className="tab pane menu divider" />
        <div className="tab pane menu search">
          <div className="ui fluid icon input">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
            />
            <i aria-hidden="true" className="search icon" />
          </div>
        </div>
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
          <UserRows users={filteredUsers} sorted={sorted} />
        </Table.Body>
      </Table>
    </Tab.Pane>
  );
};

export default UsersPane;
