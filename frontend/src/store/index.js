import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";

const store = configureStore({
  reducer: {
    user: userReducer,  
    allUsers: allUsersReducer 
  },
});

export default store;
