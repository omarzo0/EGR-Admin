// store.js
import { configureStore } from "@reduxjs/toolkit"; // Fixed typo here
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import authReducer from "../features/common/authSlice"; // Import without curly braces

export default configureStore({
  reducer: {
    header: headerSlice,
    rightDrawer: rightDrawerSlice,
    modal: modalSlice,
    auth: authReducer,
  },
});
