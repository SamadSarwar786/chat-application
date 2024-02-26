// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistedAuthReducer from "./userSlicer";
import chatSlicer from "./chatSlicer";
import { api } from "./Rtk/fetchAllChats";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: persistedAuthReducer,
    chat: chatSlicer,
    // Add other reducers here if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const persistor = persistStore(store);
