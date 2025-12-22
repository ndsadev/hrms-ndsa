import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user after login (with token)
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },

    // Update only user details
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Logout / token expiry
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setUserDetails,
  setLoading,
  setError,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
