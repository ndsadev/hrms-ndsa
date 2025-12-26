import { createSlice } from "@reduxjs/toolkit";

const onboardingSlice = createSlice({
  name: "onboarding",

  initialState: {
    selectedEmployee: null, // full employee profile
    loading: false,
    error: null,
    mode: "view", // view | edit
  },

  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setEmployeeProfile: (state, action) => {
      state.selectedEmployee = action.payload;
      state.loading = false;
    },

    setMode: (state, action) => {
      state.mode = action.payload; // "view" | "edit"
    },

    clearEmployeeProfile: (state) => {
      state.selectedEmployee = null;
      state.loading = false;
      state.error = null;
      state.mode = "view";
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  setEmployeeProfile,
  setMode,
  clearEmployeeProfile,
  setError,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
