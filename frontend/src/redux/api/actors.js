import { apiSlice } from "./apislice";
import { ACTORS_URL } from "../constants";

export const actorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createActor: builder.mutation({
      query: (data) => ({
        url: ACTORS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Actor"],
    }),
    
    updateActor: builder.mutation({
      query: (data) => ({
        url: `${ACTORS_URL}/${data.id}`,
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

    getActorById: builder.query({
      query: (id) => `${ACTORS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Actor", id }],
    }),

    getAllActors: builder.query({
      query: () => ACTORS_URL,
      providesTags: ["Actor"],
    }),
  }),
});

export const {
  useCreateActorMutation,
  useUpdateActorMutation,
  useDeleteActorMutation,
  useGetActorByIdQuery,
  useGetAllActorsQuery,
} = actorApiSlice;