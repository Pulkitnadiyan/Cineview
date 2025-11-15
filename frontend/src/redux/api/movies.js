import { apiSlice } from "./apislice";
import { MOVIES_URL,UPLOADS_URL } from "../constants";

export const movieApislice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMovies: builder.query({
            query: () => `${MOVIES_URL}/all-movies`,
            providesTags: ["Movie"],
        }),
        createMovie: builder.mutation({
            query: (newMovie) => ({
                url: `${MOVIES_URL}/create-movie`,
                method: "POST",
                body: newMovie,
            }),
            invalidatesTags: ["Movie"],
        }),
        updateMovie: builder.mutation({
            query: ({ id, updateMovie }) => ({
                url: `${MOVIES_URL}/update-movie/${id}`,
                method: "PUT",
                body: updateMovie,
            }),
            invalidatesTags: ["Movie"],
        }),
        addMovieReview: builder.mutation({
            query: (data) => ({
                url: `${MOVIES_URL}/${data.movieId}/reviews`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Movie"],
        }),
        deleteComment: builder.mutation({
            query: ({ movieId, reviewId }) => ({
                url: `${MOVIES_URL}/${movieId}/reviews/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Movie"],
        }),
deleteMovie: builder.mutation({
    query: (id) => ({
        url: `${MOVIES_URL}/delete-movie/${id}`,
        method: "DELETE",
    }),
    invalidatesTags: ["Movie"],
}),
GetSpecificMovie: builder.query({
    query: (id) => ({
        url: `${MOVIES_URL}/specific-movie/${id}`,
    }),
    providesTags: ["Movie"],
}),
uploadImage: builder.mutation({
    query: (formData) => ({
        url: `${UPLOADS_URL}`,
        method: "POST",
        body: formData,
    }),
}),
GetNewMovies: builder.query({
    query: () => ({
        url: `${MOVIES_URL}/new-movies`,
    }),
    providesTags: ["Movie"],
}),
getTopMovies: builder.query({
    query: () => ({
        url: `${MOVIES_URL}/top-movies`,
    }),
    providesTags: ["Movie"],
}),
getRandomMovies: builder.query({
    query: () => ({
        url: `${MOVIES_URL}/random-movies`,
    }),
    providesTags: ["Movie"],
}),
getTotalMovies: builder.query({
    query: () => ({
        url: `${MOVIES_URL}/total`,
    }),
    providesTags: ["Movie"],
    }),
    }),
});


export const { useGetAllMoviesQuery,useUploadImageMutation,useGetTotalMoviesQuery ,useCreateMovieMutation,useUpdateMovieMutation,useAddMovieReviewMutation,useDeleteCommentMutation,useDeleteMovieMutation,useGetSpecificMovieQuery,useGetNewMoviesQuery,useGetTopMoviesQuery,useGetRandomMoviesQuery} = movieApislice;