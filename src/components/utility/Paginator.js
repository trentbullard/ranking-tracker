import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Dropdown, Table, Button } from "semantic-ui-react";
import SortIcon from "../adminDashboard/SortIcon";

const PageSelector = props => {
  const CurrentPage = props => {
    return <Button compact content={props.currentPage} disabled />;
  };

  const PrevPage = props => {
    if (props.currentPage === 1) {
      return null;
    }
    return (
      <Button
        compact
        onClick={() => {
          props.handlePageSelect(props.currentPage - 1);
        }}
        content={"<"}
      />
    );
  };

  const NextPage = props => {
    if (props.currentPage === props.pages) {
      return null;
    }

    return (
      <Button
        compact
        onClick={() => {
          props.handlePageSelect(props.currentPage + 1);
        }}
        content={">"}
      />
    );
  };

  const FirstPage = props => {
    if (props.currentPage === 1) {
      return null;
    }
    return (
      <Button
        compact
        onClick={() => {
          props.handlePageSelect(1);
        }}
        content={"<<"}
      />
    );
  };

  const LastPage = props => {
    if (props.currentPage === props.pages) {
      return null;
    }
    return (
      <Button
        compact
        onClick={() => {
          props.handlePageSelect(props.pages);
        }}
        content={">>"}
      />
    );
  };

  return (
    <div className="page-selector">
      <FirstPage
        currentPage={props.currentPage}
        handlePageSelect={props.handlePageSelect}
        pages={props.pages}
      />
      <PrevPage
        currentPage={props.currentPage}
        handlePageSelect={props.handlePageSelect}
        pages={props.pages}
      />
      <CurrentPage
        currentPage={props.currentPage}
        handlePageSelect={props.handlePageSelect}
        pages={props.pages}
      />
      <NextPage
        currentPage={props.currentPage}
        handlePageSelect={props.handlePageSelect}
        pages={props.pages}
      />
      <LastPage
        currentPage={props.currentPage}
        handlePageSelect={props.handlePageSelect}
        pages={props.pages}
      />
    </div>
  );
};

const RowsPerPageSelector = props => {
  const options = [
    { key: 10, text: 10, value: 10 },
    { key: 25, text: 25, value: 25 },
    { key: 50, text: 50, value: 50 },
    { key: 100, text: 100, value: 100 },
  ];
  return (
    <Dropdown
      className="rows-per-page-selector"
      selection
      options={options}
      onChange={(_event, { value }) => props.onChange(value)}
      value={props.value}
    />
  );
};

const PageControls = props => {
  return (
    <div className="page-controls">
      <RowsPerPageSelector
        onChange={props.handleSelectRowsPerPage}
        value={props.rowsPerPage}
      />
      <PageSelector
        currentPage={props.currentPage}
        handlePageSelect={props.handlePageSelect}
        pages={props.pages}
      />
    </div>
  );
};

const HeaderCells = props => {
  return _.map(props.fields, (field, index) => {
    const key = Object.keys(field)[0];
    const value = Object.values(field)[0];
    return (
      <Table.HeaderCell
        className="sortable-header"
        onClick={props.handleClickHeader}
        key={`${key}`}
      >
        {key} <SortIcon header={value} sorted={props.sorted} />
      </Table.HeaderCell>
    );
  });
};

const Paginator = props => {
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const { items } = props;
  // set rows and number of pages from props.items, current page, and rowsPerPage
  useEffect(() => {
    setRows(
      _.slice(
        items,
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    );
    const remainder = items.length % rowsPerPage;
    if (remainder === 0 || remainder === items.length) {
      setPages(1);
    } else {
      setPages((items.length - remainder) / rowsPerPage + 1);
    }
  }, [items, currentPage, rowsPerPage]);

  return (
    <>
      <Table celled striped id={props.tableId}>
        <Table.Header className="ui center aligned">
          <Table.Row>
            <HeaderCells
              fields={props.columns}
              sorted={props.sorted}
              handleClickHeader={props.handleClickHeader}
            />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <props.ItemsComponent
            items={rows}
            setSelected={props.setSelected}
            setShowModal={props.setShowModal}
          />
        </Table.Body>
      </Table>
      <PageControls
        currentPage={currentPage}
        rowsPerPage={10}
        pages={pages}
        handleSelectRowsPerPage={setRowsPerPage}
        handlePageSelect={setCurrentPage}
      />
    </>
  );
};

export default Paginator;
