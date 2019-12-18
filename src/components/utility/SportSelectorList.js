import _ from "lodash";
import React, { useContext } from "react";
import { SportContext } from "../../contexts/SportContext";
import { icons } from "../../img/icons";
import "../../styles/utility/SportSelectorList.css";
import { List, Image } from "semantic-ui-react";

const SportSelectorListItem = ({ sport }) => {
  const { selectedSport, setSelectedSport } = useContext(SportContext);
  return (
    <Image
      avatar
      src={icons()[sport.iconName]}
      disabled={!selectedSport || selectedSport.id !== sport.id}
      onClick={() =>
        setSelectedSport(s => {
          if (!_.isEmpty(s) && s.id === sport.id) {
            return null;
          }
          return sport;
        })
      }
    />
  );
};

const SportSelectorList = _props => {
  const { sports } = useContext(SportContext);

  const SportIcons = _props => {
    return _.map(sports, sport => {
      return (
        <List.Item key={`${sport.iconName}-selector`}>
          <SportSelectorListItem sport={sport} />
        </List.Item>
      );
    });
  };

  return (
    <div className="sport-selector">
      <List horizontal size="huge">
        <SportIcons />
      </List>
    </div>
  );
};

export default SportSelectorList;
