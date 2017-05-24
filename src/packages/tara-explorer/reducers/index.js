/**
 * @overview Index of reducers & redux store maker
 */
import { createStore, combineReducers, applyMiddleware } from "redux";
import createHistory from "history/createMemoryHistory";
import { routerReducer, routerMiddleware } from "react-router-redux";
// Our reducers
import router from "./router";

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Combine & export
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    router: routerReducer
  }),
  applyMiddleware(middleware)
);
