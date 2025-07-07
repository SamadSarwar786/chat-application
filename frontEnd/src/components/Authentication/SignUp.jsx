import {
  Alert,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  LinearProgress,
} from "@mui/material";
import React, { useState } from "react";
import axios from '../../utils/axios-instance'
import { useNavigate } from "react-router-dom";
import { login } from "../../store/userSlicer";
import { useDispatch } from "react-redux";
import { StyledTextField, GradientButton } from "./Login";
import {
Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CloudUpload as CloudUploadIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const UploadButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  height: '56px',
  fontWeight: 'bold',
  fontSize: '14px',
  textTransform: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
}));

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all the fields");
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) {
      formData.append("pic", profilePic);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const {data:user} = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/user",
        formData,
        config
      );
      const content = {
        user,
        token: user.token,
      };
      dispatch(login(content));
      setIsLoading(false);
      setMessage("Account created successfully!");
      setIsError(false);
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setMessage(errorMessage);
    }
  };

  const picHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage("File size should be less than 5MB");
        setIsError(true);
        return;
      }
      setProfilePic(file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {isLoading && (
        <LinearProgress 
          sx={{ 
            mb: 2, 
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#3f51b5',
            }
          }} 
        />
      )}

      <Stack spacing={3}>
        <StyledTextField
          required
          fullWidth
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />

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

        <StyledTextField
          required
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-pic-upload"
            type="file"
            onChange={picHandler}
          />
          <label htmlFor="profile-pic-upload">
            <UploadButton
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
            >
              {profilePic ? `Selected: ${profilePic.name}` : "Upload Profile Picture (Optional)"}
            </UploadButton>
          </label>
          {profilePic && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1, display: 'block' }}>
              File size: {(profilePic.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          )}
        </Box>

        <GradientButton
          disabled={isLoading}
          fullWidth
          variant="contained"
          onClick={submitHandler}
          startIcon={<PersonAddIcon />}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </GradientButton>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', px: 2 }}>
            Password Requirements
          </Typography>
        </Divider>

        <Box sx={{ px: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
            • At least 6 characters long
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
            • Passwords must match
          </Typography>
        </Box>
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

export default SignUp;
