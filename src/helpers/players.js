import _ from "lodash-es";

export const getPlayersFromRecords = records => {
  let grouped = _.groupBy(records, "sport");
  return grouped;
};
