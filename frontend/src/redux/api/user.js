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
    
  }),
});

export const { useLoginMutation, useLogoutMutation,useRegisterMutation ,useProfileMutation,useGetUsersQuery} = userApislice;