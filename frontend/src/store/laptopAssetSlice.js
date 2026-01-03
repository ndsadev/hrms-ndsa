import { createSlice } from "@reduxjs/toolkit";

const laptopAssetSlice = createSlice({
  name: "laptopAssets",

  initialState: {
    list: [],           // 🔥 table data (GET ALL)
    selected: null,     // view / edit
    loading: false,     // sirf initial fetch ke liye
    error: null,
    fetched: false,     // 🔥 ek baar data aa gaya ya nahi
  },

  reducers: {
    /* =====================
       LOADING CONTROL
    ====================== */
    setLaptopAssetLoading: (state, action) => {
      state.loading = action.payload;
    },

    /* =====================
       GET ALL
    ====================== */
    setLaptopAssets: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.fetched = true; // 🔥 important
      state.error = null;
    },

    /* =====================
       CREATE (after POST)
    ====================== */
    addLaptopAsset: (state, action) => {
      state.list.unshift(action.payload); // 👈 table instantly update
    },

    /* =====================
       VIEW / EDIT SELECT
    ====================== */
    setSelectedLaptopAsset: (state, action) => {
      state.selected = action.payload;
    },

    clearSelectedLaptopAsset: (state) => {
      state.selected = null;
    },

    /* =====================
       UPDATE
    ====================== */
    updateLaptopAsset: (state, action) => {
      const index = state.list.findIndex(
        (item) => item._id === action.payload._id
      );

      if (index !== -1) {
        state.list[index] = action.payload;
      }

      if (state.selected?._id === action.payload._id) {
        state.selected = action.payload;
      }
    },

    /* =====================
       DELETE
    ====================== */
    deleteLaptopAsset: (state, action) => {
      state.list = state.list.filter(
        (item) => item._id !== action.payload
      );
    },

    /* =====================
       ERROR
    ====================== */
    setLaptopAssetError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    /* =====================
       RESET (optional)
    ====================== */
    resetLaptopAssetState: (state) => {
      state.list = [];
      state.selected = null;
      state.loading = false;
      state.error = null;
      state.fetched = false;
    },
  },
});

export const {
  setLaptopAssetLoading,
  setLaptopAssets,
  addLaptopAsset,
  setSelectedLaptopAsset,
  clearSelectedLaptopAsset,
  updateLaptopAsset,
  deleteLaptopAsset,
  setLaptopAssetError,
  resetLaptopAssetState,
} = laptopAssetSlice.actions;

export default laptopAssetSlice.reducer;
