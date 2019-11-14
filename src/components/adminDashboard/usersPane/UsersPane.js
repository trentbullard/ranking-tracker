import _ from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tab, Table, Button } from "semantic-ui-react";
import tracker from "../../../apis/tracker";
import { FlashContext } from "../../../contexts/FlashContext";
import { getDigest } from "../../../helpers/hmac";
import SortIcon from "../SortIcon";
import NewUserModal from "./NewUserModal";
import EditUserModal from "./EditUserModal";
import "../../../styles/adminDashboard/usersPane/usersPane.css";

const fieldMap = {
  id: "id",
  username: "email",
  "first name": "firstName",
  "last name": "lastName",
  "is admin?": "isAdmin",
};

const UserRows = ({
  users,
  sorted: { column, order },
  setUserUpdated,
  setUserDeleted,
  currentUser,
}) => {
  const [showEditUserModal, setShowEditUserModal] = useState(null);
  const rows = _.map(_.orderBy(users, [column], [order]), (user, index) => {
    return (
      <Table.Row
        onClick={_event => setShowEditUserModal(user)}
        key={`user-row-${index}`}
        active={
          !!showEditUserModal &&
          _.isEqualWith(showEditUserModal, user, (selected, current) => {
            return selected.id === current.id;
          })
        }
      >
        <Table.Cell>{user.id}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.isAdmin.toString()}</Table.Cell>
        <Table.Cell>{user.firstName}</Table.Cell>
        <Table.Cell>{user.lastName}</Table.Cell>
      </Table.Row>
    );
  });
  return (
    <>
      {rows}
      <EditUserModal
        showModal={showEditUserModal}
        setShowModal={setShowEditUserModal}
        setUserUpdated={setUserUpdated}
        setUserDeleted={setUserDeleted}
        currentUser={currentUser}
      />
    </>
  );
};

const UsersPane = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [term, setTerm] = useState("");
  const [sorted, setSorted] = useState({ column: "id", order: "asc" });
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [userAdded, setUserAdded] = useState(null);
  const [userUpdated, setUserUpdated] = useState(null);
  const [userDeleted, setUserDeleted] = useState(null);

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
  }, [userAdded, userUpdated, userDeleted]);

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
    const field = fieldMap[event.currentTarget.innerText.trim()];
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
            showModal={showNewUserModal}
            setShowModal={setShowNewUserModal}
            currentUser={currentUser}
          >
            <Button
              className="green"
              circular
              icon="add user"
              onClick={_event => setShowNewUserModal(true)}
            />
          </NewUserModal>
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
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              id <SortIcon header="id" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              username <SortIcon header="email" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              is admin? <SortIcon header="isAdmin" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              first name <SortIcon header="firstName" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              last name <SortIcon header="lastName" sorted={sorted} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <UserRows
            users={filteredUsers}
            sorted={sorted}
            setUserUpdated={setUserUpdated}
            setUserDeleted={setUserDeleted}
            currentUser={currentUser}
          />
        </Table.Body>
      </Table>
    </Tab.Pane>
  );
};

export default UsersPane;
