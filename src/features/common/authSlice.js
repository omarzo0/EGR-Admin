import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    adminId: null,
    accessToken: null,
    // other auth-related state
  },
  reducers: {
    setAuthData: (state, action) => {
      state.adminId = action.payload.id;
      state.accessToken = action.payload.accessToken;
    },
    clearAuthData: (state) => {
      state.adminId = null;
      state.accessToken = null;
    },
  },
});
export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
