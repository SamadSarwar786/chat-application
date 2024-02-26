import logo from "./logo.svg";
import "./App.css";
import axios from "./utils/axios-instance";
import { useEffect } from "react";
import { Outlet, RouterProvider } from "react-router-dom";
import { router } from "./Routes";
import { Alert, CssBaseline, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "./store/userSlicer";

function App() {

  const { errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="App">
      <CssBaseline />
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={3000}
        onClose={() => dispatch(setErrorMessage(""))}
      >
        <Alert severity="error">
         {errorMessage}
        </Alert>
      </Snackbar>
      <Outlet />
    </div>
  );
}

export default App;
