import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import opportunityReducer from "./opportunities";
import reviewsReducer from "./reviews";
import cartReducer from "./carts";
import addToCartReducer from "./addtocart";

const rootReducer = combineReducers({
  session: sessionReducer,
  opportunities: opportunityReducer,
  reviews: reviewsReducer,
  carts: cartReducer,
  cart_items: addToCartReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
