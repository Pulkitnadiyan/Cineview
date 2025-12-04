import { apiSlice } from "./apislice";
import { ACTORS_URL } from "../constants";

export const actorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createActor: builder.mutation({
      query: (data) => ({
        url: `${ACTORS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Actor"],
    }),
    getAllActors: builder.query({
      query: () => `${ACTORS_URL}`,
      providesTags: ["Actor"],
    }),
    getActorById: builder.query({
      query: (id) => `${ACTORS_URL}/${id}`,
      providesTags: ["Actor"],
    }),
    updateActor: builder.mutation({
      query: ({ id, data }) => ({
        url: `${ACTORS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Actor"],
    }),
    deleteActor: builder.mutation({
      query: (id) => ({
        url: `${ACTORS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Actor"],
    }),
    getTotalActors: builder.query({
        query: () => `${ACTORS_URL}/total`,
    }),
  }),
});

export const {
  useCreateActorMutation,
  useGetAllActorsQuery,
  useGetActorByIdQuery,
  useUpdateActorMutation,
  useDeleteActorMutation,
  useGetTotalActorsQuery,
} = actorApiSlice;