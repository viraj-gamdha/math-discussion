import type {
  Discussion,
  OperationFormData,
  StartingNumberFormData,
} from "@/types/discussion";
import { apiSlice } from "./apiSlice";
import type { ApiResult } from "@/types/general";

const discussionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDiscussions: builder.query<ApiResult<Discussion[]>, void>({
      query: () => "discussions",
      providesTags: ["Discussion"],
    }),
    addStartingNumber: builder.mutation<
      ApiResult<Discussion>,
      StartingNumberFormData
    >({
      query: (data) => ({
        url: "discussions/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Discussion"],
    }),
    addOperation: builder.mutation<ApiResult<Discussion>, OperationFormData>({
      query: (data: OperationFormData) => ({
        url: "discussions/operation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Discussion"],
    }),

    deleteDiscussion: builder.mutation<ApiResult<null>, string>({
      query: (id) => ({
        url: `discussions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Discussion"],
    }),
  }),
});

export const {
  useGetDiscussionsQuery,
  useAddStartingNumberMutation,
  useAddOperationMutation,
  useDeleteDiscussionMutation
} = discussionApiSlice;
