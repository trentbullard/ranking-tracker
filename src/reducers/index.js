import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import sportsReducer from "./sportReducer";

export default combineReducers({
  form: formReducer,
  sports: sportsReducer,
});
