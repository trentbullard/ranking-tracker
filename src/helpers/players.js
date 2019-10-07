import _ from "lodash";

export const getPlayersFromRecords = records => {
  let grouped = _.groupBy(records, "sport");
  return grouped;
};
