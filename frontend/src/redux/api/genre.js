import { apiSlice } from "./apislice";
import { GENRES_URL } from "../constants";

export const genreApislice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
   createGenre: builder.mutation({
    query: (newGenre) => ({
        url: `${GENRES_URL}`,
        method: "POST",
        body: newGenre,
    }),
}),

updateGenre: builder.mutation({
    query: ({ id, updateGenre }) => ({
        url: `${GENRES_URL}/${id}`,
        method: "PUT",
        body: updateGenre,
    }),
}),
deleteGenre: builder.mutation({
    query: (id) => ({
        url: `${GENRES_URL}/${id}`,
        method: "DELETE",
    }),
}),
fetchGenres: builder.query({
    query: () => ({
        url: GENRES_URL,
        
    }),
}),
getTotalGenres: builder.query({
    query: () => ({
        url: `${GENRES_URL}/total`,
    }),
}),

    }),
});

export const { useCreateGenreMutation ,useUpdateGenreMutation,useDeleteGenreMutation,useFetchGenresQuery,useGetTotalGenresQuery} = genreApislice;