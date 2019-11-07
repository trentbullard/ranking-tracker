import React, { useState, useEffect } from "react";
import tracker from "../apis/tracker";
import { getDigest } from "../helpers/hmac";

export const SportContext = React.createContext();

const SportProvider = props => {
  const [sports, setSports] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);

  useEffect(() => {
    const getSports = async () => {
      const { data } = await tracker.get("/sports", {
        params: {
          where: { enabled: true },
          token: getDigest("get", "/sports"),
        },
      });
      const returnedSports = await data;
      setSports(returnedSports);
      setSelectedSport(returnedSports[0]);
    };
    getSports();
  }, []);

  const state = {
    sports,
    setSports,
    selectedSport,
    setSelectedSport,
  };

  return (
    <SportContext.Provider value={state}>
      {props.children}
    </SportContext.Provider>
  );
};

export default SportProvider;
