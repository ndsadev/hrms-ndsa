import { createSlice } from "@reduxjs/toolkit";

const onboardingSlice = createSlice({
  name: "onboarding",

  initialState: {
    /* ================= TABLE ================= */
    employees: [],
    listLoading: false,
    hasFetched: false,

    /* ================= MODAL ================= */
    selectedEmployee: null,
    loading: false,
    error: null,
    mode: "view",

    showModal: false,
  },

  reducers: {
    /* ================= TABLE ================= */

    startListLoading: (state) => {
      state.listLoading = true;
    },

    setEmployees: (state, action) => {
      state.employees = action.payload;
      state.listLoading = false;
      state.hasFetched = true;
    },

    setListError: (state) => {
      state.listLoading = false;
      state.hasFetched = true;
    },

    // ADD 2: EDIT ke baad table update (NO BLINK)
    updateEmployeeInList: (state, action) => {
      const { employeeId, updates } = action.payload;

      const index = state.employees.findIndex(
        (e) => e.employeeId === employeeId
      );

      if (index !== -1) {
        state.employees[index] = {
          ...state.employees[index],
          ...updates,
          employeeId: state.employees[index].employeeId,
        };

      }
    },

    /* ================= MODAL ================= */

    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setEmployeeProfile: (state, action) => {
      state.selectedEmployee = action.payload;
      state.loading = false;
      state.showModal = true;
    },

    closeModal: (state) => {
      state.showModal = false;
      state.selectedEmployee = null;
      state.mode = "view";
      state.loading = false;
      state.error = null;
    },

    setMode: (state, action) => {
      state.mode = action.payload;
    },

    clearEmployeeProfile: (state) => {
      state.selectedEmployee = null;
      state.loading = false;
      state.error = null;
      state.mode = "view";
      state.showModal = false;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  /* table */
  startListLoading,
  setEmployees,
  setListError,
  updateEmployeeInList,
  /* modal */
  startLoading,
  setEmployeeProfile,
  setMode,
  closeModal,
  clearEmployeeProfile,
  setError,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
