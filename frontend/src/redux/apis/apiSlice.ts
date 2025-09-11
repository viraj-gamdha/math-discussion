import {
  type BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import type { UserInfo } from "@/types/user";
import { logout, setUserInfo } from "../features/authSlice";

// Base query
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState, extraOptions }) => {
    const headerData = (getState() as RootState).auth.userInfo;
    headers.set("Authorization", `Bearer ${headerData?.accessToken || ""}`);
    return headers;
  },
});

// Reauth for some cases
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Access token expired or invalid try to refresh first and try again
  if (result?.error?.status === 403) {
    const refreshResult = await baseQuery(
      "auth/refresh_token",
      api,
      extraOptions
    );

    if (
      refreshResult?.data &&
      typeof refreshResult.data === "object" &&
      "data" in refreshResult.data
    ) {
      // Type assertion here
      const typedData = refreshResult.data as { data: UserInfo };
      api.dispatch(setUserInfo(typedData.data));

      // Retry original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      ///nothing worked just logout user
      if (
        refreshResult?.error?.status === 403 ||
        refreshResult?.error?.status === 401
      ) {
        api.dispatch(logout({}));
      }
      return refreshResult;
    }

    // Refresh token expired or not valid or not found
  } else if (result.error?.status === 401) {
    api.dispatch(logout({}));
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Discussion"],
  endpoints: (_builder) => ({}),
});
