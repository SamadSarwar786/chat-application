// src/reducers/chatSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../utils/axios-instance";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { ACCESS_AND_FETCH_CHAT, CREATE_GRP } from "../utils/endPoints";
import { api } from "./Rtk/fetchAllChats";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "user", "token"], // Include only these keys for persistence
};

// export const fetchAllChats = createAsyncThunk(
//   "chat/fetchAllChats",
//   async (thunkAPI) => {
//     try {
//       const { data } = await axios.get(process.env.REACT_APP_BASE_URL + ACCESS_AND_FETCH_CHAT);
//       return data;
//     } catch (error) {
//       // Handle errors here
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
// export const createNewGroup = createAsyncThunk(
//   "chat/createNewGroup",
//   async (payLoad, thunkAPI) => {
//     try {
//       let {users ,name} = payLoad;
//       users = JSON.stringify(users);
//       const { data } = await axios.post(CREATE_GRP, { name, users });
//       await thunkAPI.dispatch(fetchAllChats());
//       // return data;
//     } catch (error) {
//       // Handle errors here
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );

// export const fetchSelectedChat = createAsyncThunk(
//   "chat/fetchSelectedChat",
//   async (userId, thunkAPI) => {
//     try {
//       const { data } = await axios.post(process.env.REACT_APP_BASE_URL + ACCESS_AND_FETCH_CHAT, { userId });
//       return data;
//     } catch (error) {
//       // Handle errors here
//       return thunkAPI.rejectWithValue({ error: error.message });
//     }
//   }
// );
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChat: null,
    singleChatStatus: "idle",
    chats: [],
    chatsStatus: "idle",
    error: null,
    notification:[],
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addNotification:(state,action) => {
      state.notification.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.fetchSelectedChat.matchFulfilled, (state, action) => {
      state.selectedChat = action.payload;
    })
    // builder
    //   .addCase(fetchSelectedChat.pending, (state) => {
    //     state.singleChatStatus = "loading";
    //   })
    //   .addCase(fetchSelectedChat.fulfilled, (state, action) => {
    //     state.singleChatStatus = "succeeded";
    //     state.selectedChat = action.payload;
    //   })
    //   .addCase(fetchSelectedChat.rejected, (state, action) => {
    //     state.singleChatStatus = "failed";
    //     state.error = action.payload.error;
    //   });
    // builder
    //   .addCase(fetchAllChats.pending, (state) => {
    //     state.chatsStatus = "loading";
    //   })
    //   .addCase(fetchAllChats.fulfilled, (state, action) => {
    //     state.chatsStatus = "succeeded";
    //     state.chats = action.payload;
    //   })
    //   .addCase(fetchAllChats.rejected, (state, action) => {
    //     state.chatsStatus = "failed";
    //     state.error = action.payload.error;
    //   });
  },
});

// const persistedAuthReducer = persistReducer(authPersistConfig, chatSlice.reducer);
export const { setSelectedChat,addNotification } = chatSlice.actions;

export const allChats = (state) => state.chat.chats;

// export default persistedAuthReducer;
export default chatSlice.reducer;
