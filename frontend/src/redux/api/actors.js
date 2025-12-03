import { apiSlice } from "./apislice";
import { ACTORS_URL } from "../constants"; // Define this in constants.js

export const actorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createActor: builder.mutation({
      query: (data) => ({
        url: `${ACTORS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getActorById: builder.query({
      query: (id) => `${ACTORS_URL}/${id}`,
    }),
    getAllActors: builder.query({
        query: () => `${ACTORS_URL}`,
    }),
    // ... update and delete
  }),
});

export const { useCreateActorMutation, useGetActorByIdQuery, useGetAllActorsQuery } = actorApiSlice;