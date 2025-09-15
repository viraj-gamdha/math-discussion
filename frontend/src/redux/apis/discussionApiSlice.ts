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
      // invalidatesTags: ["Discussion"],
      async onQueryStarted(_data, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(
              discussionApiSlice.util.updateQueryData(
                "getDiscussions",
                undefined,
                (draft) => {
                  draft.data.push(data.data);
                }
              )
            );
          }
        } catch (error) {
          console.log("Create Discussion Error", error);
        }
      },
    }),
    addOperation: builder.mutation<ApiResult<Discussion>, OperationFormData>({
      query: (data: OperationFormData) => ({
        url: "discussions/operation",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["Discussion"],
      async onQueryStarted(_data, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(
              discussionApiSlice.util.updateQueryData(
                "getDiscussions",
                undefined,
                (draft) => {
                  draft.data.push(data.data);
                }
              )
            );
          }
        } catch (error) {
          console.log("Add Operation Error", error);
        }
      },
    }),

    deleteDiscussion: builder.mutation<ApiResult<null>, string>({
      query: (id) => ({
        url: `discussions/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["Discussion"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          if (result.success) {
            // Remove discussion from getDiscussions query cache
            dispatch(
              discussionApiSlice.util.updateQueryData(
                "getDiscussions",
                undefined,
                (draft) => {
                  draft.data = draft.data.filter(
                    (discussion) => discussion._id !== id
                  );
                }
              )
            );
          }
        } catch (error) {
          console.log("Delete Error", error);
        }
      },
    }),
  }),
});

export const {
  useGetDiscussionsQuery,
  useAddStartingNumberMutation,
  useAddOperationMutation,
  useDeleteDiscussionMutation,
} = discussionApiSlice;
