import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();
browserHistory.listen((location, action) => {
  window.scrollTo(0, 0);
});

export default browserHistory;
