import { apiSlice } from "./apislice";
import { USERS_URL } from "../constants";
import { logout } from "../features/auth/authslice";

export const userApislice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
        query: (data) => ({
            url: `${USERS_URL}`,
            method: "POST",
            body: data,
        }),
    }), 
    logoutUser: builder.mutation({
        query: () => ({
            url: `${USERS_URL}/logout`,
            method: "POST",
        }),
    }),
    profile: builder.mutation({
        query: (data) => ({
            url: `${USERS_URL}/profile`,
            method: "PUT",
            body:data
        }),
    }),
    getUsers: builder.query({
        query: () => ({
            url: USERS_URL,
        }),
    }),
    addFavoriteMovie: builder.mutation({
        query: (data) => ({
            url: `${USERS_URL}/profile/favorites`,
            method: "POST",
            body: data,
        }),
    }),
    removeFavoriteMovie: builder.mutation({
        query: (data) => ({
            url: `${USERS_URL}/profile/favorites`,
            method: "DELETE",
            body: data,
        }),
    }),
    getFavoriteMovies: builder.query({
        query: () => ({
            url: `${USERS_URL}/profile/favorites`,
        }),
        keepUnusedDataFor: 5,
    }),
    addMovieToWatchlist: builder.mutation({
        query: (data) => ({
            url: `${USERS_URL}/profile/watchlist`,
            method: "POST",
            body: data,
        }),
    }),
    removeMovieFromWatchlist: builder.mutation({
        query: (data) => ({
            url: `${USERS_URL}/profile/watchlist`,
            method: "DELETE",
            body: data,
        }),
    }),
    getWatchlist: builder.query({
        query: () => ({
            url: `${USERS_URL}/profile/watchlist`,
        }),
        keepUnusedDataFor: 5,
    }),
    
  }),
});

export const { useLoginMutation, useLogoutMutation,useRegisterMutation ,useProfileMutation,useGetUsersQuery, useAddFavoriteMovieMutation, useRemoveFavoriteMovieMutation, useGetFavoriteMoviesQuery, useAddMovieToWatchlistMutation, useRemoveMovieFromWatchlistMutation, useGetWatchlistQuery} = userApislice;