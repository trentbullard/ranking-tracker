import _ from "lodash-es";
import React from "react";
import SportAvatarItem from "./SportAvatarItem";

const getSportAvatarItems = sports =>
  _.map([].concat(sports || []), sport => {
    return <SportAvatarItem sport={sport} key={`${sport.name}AvatarItem`} />;
  });

const SportList = props => (
  <div className="ui center aligned header">
    <div className="ui grid massive horizontal list">
      {getSportAvatarItems(props.sports)}
    </div>
  </div>
);

export default SportList;
