import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [], 
  loading: false, 
  error: null,  
};

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    setAllUsersLoading: (state, action) => {
      state.loading = action.payload;
    },

    setAllUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },

    setAllUsersError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearAllUsers: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAllUsersLoading,
  setAllUsers,
  setAllUsersError,
  clearAllUsers,
} = allUsersSlice.actions;

export default allUsersSlice.reducer;
