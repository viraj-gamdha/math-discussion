import { apiSlice } from "./apiSlice";
import { setUserInfo, logout } from "../features/authSlice";
import type { ApiResult } from "@/types/general";
import type { AuthFormInputs, UserInfo } from "@/types/user";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResult<UserInfo>, AuthFormInputs>({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //dispatch userInfo (including header data) to global redux store
          dispatch(setUserInfo(data.data));
        } catch (error) {
          console.log("Login Error", error);
        }
      },
    }),

    signup: builder.mutation<ApiResult<UserInfo>, AuthFormInputs>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //dispatch userInfo (including header data) to global redux store
          dispatch(setUserInfo(data.data));
        } catch (error) {
          console.log("Login Error", error);
        }
      },
    }),

    //
    refresh: builder.mutation<ApiResult<UserInfo>, {}>({
      query: () => ({
        url: "auth/refresh_token",
        method: "GET",
      }),

      // We are globally setting user info in to redux
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          ////user info in data
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(setUserInfo(data.data));
          }
          // Update headers with the new header data
        } catch (err) {
          console.log("Refresh Request Error", err);
        }
      },
    }),

    logout: builder.mutation<ApiResult<{}>, {}>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(logout({}));
            dispatch(apiSlice.util.resetApiState());
          }
        } catch (error) {
          console.log("Error signing Out user", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApiSlice;
