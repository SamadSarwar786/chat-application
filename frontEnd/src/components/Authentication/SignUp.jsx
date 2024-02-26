import {
  Alert,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import axios from '../../utils/axios-instance'
import { useNavigate } from "react-router-dom";
import { login } from "../../store/userSlicer";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const submitHandler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    // const payLoad = {
    //   name,
    //   email,
    //   password,
    //   pic: profilePic,
    // };
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("pic", profilePic);

    console.log('img ',formData.get('pic'));
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const { user } = await axios.post(
        "/api/user",
        formData,
        config
      );
      // localStorage.setItem("userInfo", JSON.stringify(data));
      const content = {
        user,
        token: user.token,
      };
      dispatch(login(content));
      setIsLoading(false);
      setMessage(user.message);
      setIsError(false);
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
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

  const picHandler = (e) => {
    setProfilePic(e.target.files[0]);
    console.log('images ',e.target.files[0]); 
  }
  return (
    <Stack spacing={1.5} mt="10px" direction="column">
      <TextField
        required
        margin="normal"
        autoComplete="firstName"
        fullWidth
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        required
        margin="normal"
        autoComplete="email"
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        margin="normal"
        fullWidth
        label="Password"
        autoComplete="current-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        required
        margin="normal"
        fullWidth
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
      <TextField
        required
        margin="normal"
        fullWidth
        type="file"
        name="image"
        accept="image/*"
        focused
        onChange={picHandler}
        label="Update Your Picture"
      />
      <Button
        disabled={isLoading}
        fullWidth
        variant="contained"
        onClick={submitHandler}
      >
        Sign Up
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

export default SignUp;
