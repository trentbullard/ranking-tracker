import React, { useState, useEffect } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";

export const SportContext = React.createContext();

const SportProvider = props => {
  const [sports, setSports] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [sportDeleted, setSportDeleted] = useState(null);
  const [sportUpdated, setSportUpdated] = useState(null);
  const [sportAdded, setSportAdded] = useState(null);
  const [showDisabled, setShowDisabled] = useState(false);

  useEffect(() => {
    const getSports = async () => {
      const { data } = await tracker.get("/sports", {
        params: {
          where: showDisabled ? null : { enabled: true },
          token: getDigest("get", "/sports"),
        },
      });
      const returnedSports = await data;
      setSports(returnedSports);
      setSelectedSport(returnedSports[0]);
    };
    getSports();
  }, [sportDeleted, sportUpdated, sportAdded, showDisabled]);

  const state = {
    sports,
    setSports,
    selectedSport,
    setSelectedSport,
    setSportDeleted,
    setSportUpdated,
    setSportAdded,
    setShowDisabled,
  };

  return (
    <SportContext.Provider value={state}>
      {props.children}
    </SportContext.Provider>
  );
};

export default SportProvider;
