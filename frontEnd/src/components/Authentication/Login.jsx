import {
  Alert,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import axios from "../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setToken } from "../../store/userSlicer";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
      borderWidth: '2px',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
    padding: '14px 16px',
  },
  '& .MuiFormLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#3f51b5',
    },
  },
  '& .MuiInputAdornment-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
  borderRadius: '12px',
  color: 'white',
  height: '48px',
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'none',
  boxShadow: '0 4px 20px rgba(63, 81, 181, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #303f9f 30%, #1976d2 90%)',
    boxShadow: '0 6px 25px rgba(63, 81, 181, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const GuestButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  height: '48px',
  fontWeight: 'bold',
  fontSize: '16px',
  textTransform: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
}));

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
      setMessage("Please enter the user details");
      setIsError(true);
      return;
    }
    
    setIsLoading(true);
    const payLoad = {
      email,
      password,
    };
    
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/user/login",
        payLoad
      );
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
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <LoginIcon sx={{ fontSize: 40, color: '#3f51b5', mb: 1 }} />
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Sign in to your account
        </Typography>
      </Box>

      <Stack spacing={3}>
        <StyledTextField
          required
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <StyledTextField
          required
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <GradientButton
          disabled={isLoading}
          fullWidth
          variant="contained"
          onClick={submitHandler}
          startIcon={<LoginIcon />}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </GradientButton>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', px: 2 }}>
            or
          </Typography>
        </Divider>

        <GuestButton
          fullWidth
          variant="outlined"
          onClick={() => {
            setEmail("guest@gmail.com");
            setPassword("123456");
          }}
          startIcon={<PersonIcon />}
        >
          Try as Guest User
        </GuestButton>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={message !== ""}
        onClose={() => setMessage("")}
        autoHideDuration={4000}
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
    </Box>
  );
};

export default Login;
