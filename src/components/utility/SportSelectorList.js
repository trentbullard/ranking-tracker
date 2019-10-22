import _ from "lodash";
import React, { useContext } from "react";
import { SportContext } from "../../contexts/SportContext";
import { icons } from "../../img/icons";

const SportSelectorList = props => {
  const { sports, selectedSport, setSelectedSport } = useContext(SportContext);
  if (!selectedSport) {
    return null;
  }

  const sportIcons = _.map(sports, sport => {
    const disabled = selectedSport.id === sport.id ? "" : "disabled";
    return (
      <div className="item" key={`${sport.name.toLowerCase()}-selector`}>
        <img
          className={`ui avatar image ${disabled}`}
          src={icons()[sport.name.toLowerCase()]}
          onClick={() => setSelectedSport(sport)}
          alt={`${sport.name}-selector`}
        ></img>
      </div>
    );
  });

  const className = props.className || "sport-selector";
  return (
    <div className={className}>
      <div className="ui huge horizontal list">{sportIcons}</div>
    </div>
  );
};

export default SportSelectorList;
