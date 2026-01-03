import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";
import preboardingReducer from "./preboardingSlice";
import onboardingReducer from "./onboardingSlice";
import laptopAssetReducer from "./laptopAssetSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    preboarding: preboardingReducer,
    onboarding: onboardingReducer,
    laptopAssets: laptopAssetReducer,

  },
});

export default store;
