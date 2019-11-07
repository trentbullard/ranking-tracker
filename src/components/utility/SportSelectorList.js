import _ from "lodash";
import React, { useContext } from "react";
import { SportContext } from "../../contexts/SportContext";
import { icons } from "../../img/icons";
import "../../styles/utility/SportSelectorList.css";
import { List, Image } from "semantic-ui-react";
import Loading from "../utility/Loading";

const SportSelectorList = _props => {
  const { sports, selectedSport, setSelectedSport } = useContext(SportContext);

  const SportIcons = _props => {
    if (!selectedSport || _.isEmpty(sports)) {
      return <Loading />;
    }

    return _.map(sports, sport => {
      return (
        <List.Item key={`${sport.iconName}-selector`}>
          <Image
            avatar
            src={icons()[sport.iconName]}
            disabled={selectedSport.id !== sport.id}
            onClick={() => setSelectedSport(sport)}
          ></Image>
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
