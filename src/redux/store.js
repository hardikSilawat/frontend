import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, selectUser, selectAdmin, setUser, setAdmin } from "./reducers";

// Create and export the store with the root reducer
export const store = configureStore({
  reducer: rootReducer,
});

// Export all actions and selectors
export { selectUser, selectAdmin, setUser, setAdmin };
