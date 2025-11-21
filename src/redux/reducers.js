import { createSlice } from "@reduxjs/toolkit";

// Create a slice with dynamic name
const createDataSlice = (name) => {
  const slice = createSlice({
    name,
    initialState: null,
    reducers: {
      [`set${name.charAt(0).toUpperCase() + name.slice(1)}`]: (_, { payload }) => payload,
    }
  });
  
  return {
    reducer: slice.reducer,
    action: slice.actions[`set${name.charAt(0).toUpperCase() + name.slice(1)}`],
    selector: (state) => state[name]
  };
};

// Create all slices
const slices = {
  user: createDataSlice('user'),
  admin: createDataSlice('admin')
};

// Export all actions
export const { setUser } = { setUser: slices.user.action };
export const { setAdmin } = { setAdmin: slices.admin.action };

// Export all selectors
export const selectUser = slices.user.selector;
export const selectAdmin = slices.admin.selector;

// Combine all reducers
export const rootReducer = Object.entries(slices).reduce((acc, [key, { reducer }]) => {
  acc[key] = reducer;
  return acc;
}, {});
