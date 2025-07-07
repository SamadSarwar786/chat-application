import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import React from "react";
const Home = React.lazy(() => import("./Pages/Home"));
const Chat = React.lazy(() => import("./Pages/Chat"));
const App = React.lazy(() => import("./App"));
export const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Home />} />
      </Route>
  )
);
