import _ from "lodash";
import React, { useContext, useState, useEffect } from "react";
import { Tab, Table } from "semantic-ui-react";
import { SportContext } from "../../../contexts/SportContext";
import Loading from "../../utility/Loading";
import TabControls from "../TabControls";
import SortIcon from "../SortIcon";
import SportRows from "./SportRows";

const fieldMap = {
  id: "id",
  name: "name",
  "created at": "createdAt",
  "winning score": "winningScore",
  "team names": "teamNames",
  "position names": "positionNames",
  enabled: "enabled",
  "players per team": "playersPerTeam",
  "icon name": "iconName",
};

const SportsPane = _props => {
  const [sorted, setSorted] = useState({ column: "id", order: "asc" });
  const [sortedSports, setSortedSports] = useState([]);
  const { sports } = useContext(SportContext);

  useEffect(() => {
    const { column, order } = sorted;
    if (!_.isEmpty(sports)) {
      setSortedSports(_.orderBy(sports, [column], [order]));
    }
  }, [sorted, sports]);

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

  if (_.isEmpty(sports)) {
    return <Loading />;
  }

  return (
    <Tab.Pane attached={false}>
      <TabControls ButtonWrapper={"div"} />
      <Table celled striped id="sportsTable">
        <Table.Header className="center aligned">
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
              name <SortIcon header="name" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              winning score <SortIcon header="winningScore" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              team names <SortIcon header="teamNames" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              position names <SortIcon header="positionNames" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              enabled <SortIcon header="enabled" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              players per team{" "}
              <SortIcon header="playersPerTeam" sorted={sorted} />
            </Table.HeaderCell>
            <Table.HeaderCell
              className="sortable-header"
              onClick={handleClickHeader}
            >
              icon name <SortIcon header="iconName" sorted={sorted} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <SportRows sports={sortedSports} />
        </Table.Body>
      </Table>
    </Tab.Pane>
  );
};

export default SportsPane;
