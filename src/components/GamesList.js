import _ from "lodash-es";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";
import BackArrow from "./utility/BackArrow";
import Footer from "./Footer";

const GamesList = props => {
  return (
    <>
      <div className="ui fluid icon input disabled" key="gamesSearch">
        <input type="text" placeholder="Search..." />
        <i aria-hidden="true" className="search icon" />
      </div>
      <BackArrow url="/" key="back-arrow" />
      <Footer key="footer" />
    </>
  );
};

export default GamesList;

// class GamesList extends Component {

//   renderGames = () => {
//     return _.map(this.props.games, game => {
//       return (
//         <GamesListItem
//           game={game}
//           sport={this.props.sports[game.sport]}
//           key={`game-${game.id}`}
//         ></GamesListItem>
//       );
//     });
//   };

//   renderGamesList = () => {
//     if (Object.keys(this.props.sports).length < 1) {
//       return (
//         <div className="ui center aligned header" key="no-games-error">
//           Failed to load sports.
//         </div>
//       );
//     }
//     return (
//       <InfiniteScroll
//         className="ui very relaxed middle aligned striped divided list"
//         key="games-list"
//         pageStart={0}
//         loadMore={this.props.getGamesByPage}
//         hasMore={!this.props.loading && this.props.hasMore}
//         loader={
//           <div className="item" key="loader">
//             <h4 className="ui center aligned header">Loading...</h4>
//           </div>
//         }
//       >
//         {this.renderGames()}
//       </InfiniteScroll>
//     );
//   };

//   render() {
//     return [
//       this.renderGamesList(),
//     ];
//   }
// }
