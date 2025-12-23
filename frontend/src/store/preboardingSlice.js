import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,     // PreboardingProfile
  loading: false,
  error: null,
};

const preboardingSlice = createSlice({
  name: "preboarding",
  initialState,
  reducers: {
    // Start API call
    setPreboardingLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Save / Fetch success
    setPreboardingProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Error state
    setPreboardingError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear on logout
    clearPreboardingProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setPreboardingLoading,
  setPreboardingProfile,
  setPreboardingError,
  clearPreboardingProfile,
} = preboardingSlice.actions;

export default preboardingSlice.reducer;
