import _ from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tab, Table } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { FlashContext } from "../../../contexts/FlashContext";
import { getDigest } from "../../../helpers/hmac";
import "../../../styles/newUserModal.css";
import NewUserModal from "./NewUserModal";

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
  const [showModal, setShowModal] = useState(false);
  const [userAdded, setUserAdded] = useState(null);

  const { addFlash } = useContext(FlashContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedAddFlash = useCallback(message => addFlash(message), [
    userAdded,
  ]);

  // getUsers
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
  }, [userAdded]);

  // filtering
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

  // sorting
  useEffect(() => {
    const { column, order } = sorted;
    setFilteredUsers(fuArr => _.orderBy(fuArr, [column], [order]));
  }, [sorted]);

  // addFlash on user create
  useEffect(() => {
    if (!!userAdded) {
      const { email } = userAdded;
      memoizedAddFlash(`user created successfully: ${email}`);
    }
  }, [memoizedAddFlash, userAdded]);

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
          <NewUserModal
            userAdded={setUserAdded}
            showModal={showModal}
            setShowModal={setShowModal}
          />
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
            <Table.HeaderCell className="sortable-header" onClick={handleClickHeader}>
              id
            </Table.HeaderCell>
            <Table.HeaderCell className="sortable-header" onClick={handleClickHeader}>
              username
            </Table.HeaderCell>
            <Table.HeaderCell className="sortable-header" onClick={handleClickHeader}>
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
