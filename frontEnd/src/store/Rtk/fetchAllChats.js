import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ACCESS_AND_FETCH_CHAT,
  CREATE_GRP,
  MESSAGE,
  REMOVE_FROM_GRP,
  UPDATE_GRP,
} from "../../utils/endPoints";
import { selectedChat, setSelectedChat } from "../chatSlicer";
import { store } from "..";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000",
    prepareHeaders: (headers, { getState }) => {
      // Get the token from your Redux store or wherever it's stored
      const state = store.getState();
      console.log(state.auth.token);
      const token = state.auth.token;

      // If a token is available, set the Authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // You can also modify other headers if needed
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }), // Replace with your API base URL
  tagTypes: ["Chats", "Messages"],
  endpoints: (builder) => ({
    fetchData: builder.query({
      query: () => ACCESS_AND_FETCH_CHAT,
      providesTags: ["Chats"], // Replace with your actual endpoint
    }),
    updateGrp: builder.mutation({
      query: (updatedUserData) => ({
        url: UPDATE_GRP, // Assuming a RESTful API with an endpoint for users
        method: "PUT",
        body: updatedUserData, // The data you want to update
      }),
      invalidatesTags: ["Chats"],
      async onQueryStarted(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          queryFulfilled,
          getCacheEntry,
          updateCachedData,
        }
      ) {
        try {
          const { data: updatedGroupChat } = await queryFulfilled;
          console.log("updatedGroupChat", updatedGroupChat);
          store.dispatch(setSelectedChat(updatedGroupChat));
        } catch (error) {
          console.log("updatedGroupChat", error);
        }
      },
    }),
    createGrp: builder.mutation({
      query: (userData) => ({
        url: CREATE_GRP, // Assuming a RESTful API with an endpoint for users
        method: "POST",
        body: userData, // The data you want to update
      }),
      invalidatesTags: ["Chats"],
    }),
    leaveGrp: builder.mutation({
      query: (userData) => ({
        url: REMOVE_FROM_GRP, // Assuming a RESTful API with an endpoint for users
        method: "PUT",
        body: userData, // The data you want to update
      }),
      invalidatesTags: ["Chats"],
      async onQueryStarted(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          queryFulfilled,
          getCacheEntry,
          updateCachedData,
        }
      ) {
        try {
          await queryFulfilled;
          store.dispatch(setSelectedChat(null));
        } catch (error) {
          console.log("updatedGroupChat", error);
        }
      },
    }),
    sendMessage: builder.mutation({
      query: (payLoad) => ({
        url: MESSAGE, // Assuming a RESTful API with an endpoint for users
        method: "POST",
        body: payLoad, // The data you want to update
      }),
      invalidatesTags: ["Messages"],
    }),
    getAllMessages: builder.query({
      query: (chatId) => ({
        url: `${MESSAGE}/${chatId} `, // Assuming a RESTful API with an endpoint for users
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
  }),
});

export const {
  useFetchDataQuery,
  useUpdateGrpMutation,
  useCreateGrpMutation,
  useLeaveGrpMutation,
  useSendMessageMutation,
  useGetAllMessagesQuery,
} = api;
