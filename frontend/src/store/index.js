import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";
import preboardingReducer from "./preboardingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    preboarding: preboardingReducer,
  },
});

export default store;
