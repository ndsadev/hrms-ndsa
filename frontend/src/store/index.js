import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";
import preboardingReducer from "./preboardingSlice";
import onboardingReducer from "./onboardingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    preboarding: preboardingReducer,
    onboarding: onboardingReducer,
  },
});

export default store;
