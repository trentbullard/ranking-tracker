import _ from "lodash-es";
import React, { useContext } from "react";
import SportAvatarItem from "./SportAvatarItem";
import { SportContext } from "../contexts/SportContext";

const getSportAvatarItems = sports =>
  _.map([].concat(sports || []), sport => {
    return <SportAvatarItem sport={sport} key={`${sport.name}AvatarItem`} />;
  });

const SportList = () => {
  const { sports } = useContext(SportContext);

  return (
    <div className="ui center aligned header">
      <div className="ui grid massive horizontal list">
        {getSportAvatarItems(sports)}
      </div>
    </div>
  );
};

export default SportList;
