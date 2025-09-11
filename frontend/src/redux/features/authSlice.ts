import type { UserInfo } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/react";

const initialState: { userInfo: UserInfo | null } = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      const newUserInfo = action.payload;
      state.userInfo = newUserInfo;
      localStorage.setItem("persist_signin", JSON.stringify(true));
    },
    logout: (state, _action) => {
      state.userInfo = null;
      localStorage.setItem("persist_signin", JSON.stringify(false));
    },
  },
});

// Setters of state using useAppDispatch
export const { setUserInfo, logout } = authSlice.actions;
// Can get current state of this slice using useAppSelector

// To register to the store
export const authReducer = authSlice.reducer;
