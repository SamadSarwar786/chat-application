import {
  Alert,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import axios from "../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setToken } from "../../store/userSlicer";

export const StyledTextField = styled(TextField)({
  border: "1px solid #fff",
  ".MuiOutlinedInput-input": {
    color: "white",
  },
  ".MuiFormLabel-root": {
    color: "white",
  },
  ".Mui-focused": {
    color: "white",
    border: "none !important",
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async () => {
    if (!email || !password) {
      setMessage("Plese enter the user details");
      setIsError(true);
    }
    const payLoad = {
      email,
      password,
    };
    console.log("payload", payLoad);
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/user/login",
        payLoad
      );
      console.log("user", data);
      setIsLoading(false);
      setIsError(false);
      setMessage("Logged In Successfully");

      const content = {
        user: data,
        token: data.token,
      };
      dispatch(login(content));
      navigate("/chat");
    } catch (error) {
      console.log("error", error);
      setIsError(true);
      setIsLoading(false);
      const {
        response: {
          data: { message },
        },
      } = error;
      setMessage(message || "Try again after some time");
    }
  };
  return (
    <Stack spacing={1.5} mt="10px" direction="column">
      <StyledTextField
        required
        margin="normal"
        autoComplete="email"
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <StyledTextField
        required
        margin="normal"
        fullWidth
        label="Password"
        autoComplete="current-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={isLoading}
        fullWidth
        variant="contained"
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        fullWidth
        color="error"
        variant="contained"
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={message !== ""}
        onClose={() => setMessage("")}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => setMessage("")}
          severity={isError ? "error" : "success"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Login;
