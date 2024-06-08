// src/reducers/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../utils/axios-instance";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { SEARCH_USERS } from "../utils/endPoints";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "user", "token"], // Include only these keys for persistence
};

export const fetchSearchUsers = createAsyncThunk(
  "chat/fetchSearchUsers",
  async (query, thunkAPI) => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_BASE_URL + SEARCH_USERS + "?search=" + query
      );
      
      return data;
    } catch (error) {
      // Handle errors here
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
    searchResult: [],
    searchStatus: "idle",
    errorMessage: "",
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    resetSearch: (state, action) => {
      state.searchResult = [];
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchUsers.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(fetchSearchUsers.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResult = action.payload;
      })
      .addCase(fetchSearchUsers.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.error = action.payload.error;
      });
  },
});

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer
);

export const { login, logout, setToken, resetSearch, setErrorMessage } =
  authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const getUser = (state) => state.auth.user;
export const getToken = (state) => state.auth.token;

export default persistedAuthReducer;
