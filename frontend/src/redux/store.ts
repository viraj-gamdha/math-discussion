import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apis/apiSlice";
import { authReducer } from "./features/authSlice";

export const store = configureStore({
  reducer: {
    ///for apis
    [apiSlice.reducerPath]: apiSlice.reducer,
    /// other features
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
