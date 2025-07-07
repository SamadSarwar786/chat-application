import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { Chat as ChatIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../store/userSlicer";
import ProfileModal from "./ProfileModal";
import { styled } from "@mui/material/styles";

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "16px",
  margin: "16px",
  padding: "12px 24px",
  height: "60px",
  position: "relative",
  zIndex: 10,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const StyledSearchButton = styled(Button)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  color: "white",
  textTransform: "none",
  fontWeight: "medium",
  padding: "8px 16px",
  '&:hover': {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
}));

const StyledProfileButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
  borderRadius: "12px",
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  padding: "8px 16px",
  boxShadow: "0 4px 15px rgba(63, 81, 181, 0.3)",
  '&:hover': {
    background: "linear-gradient(135deg, #303f9f 0%, #1976d2 100%)",
    boxShadow: "0 6px 20px rgba(63, 81, 181, 0.4)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  color: "white",
  marginRight: "8px",
  '&:hover': {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    color: "white",
    minWidth: "180px",
  },
  '& .MuiMenuItem-root': {
    padding: "12px 16px",
    borderRadius: "8px",
    margin: "4px 8px",
    '&:hover': {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  '& .MuiDivider-root': {
    borderColor: "rgba(255, 255, 255, 0.2)",
    margin: "8px 0",
  },
}));

export const Header = ({ openDrawer }) => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  const handleDrawer = () => {
    openDrawer(true);
  };

  return (
    <StyledHeader>
      <Tooltip title="Search users to chat" placement="bottom-start">
        <StyledSearchButton
          onClick={handleDrawer}
          startIcon={<SearchIcon />}
        >
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: "14px",
              fontWeight: "medium",
            }}
          >
            Search Users
          </Typography>
        </StyledSearchButton>
      </Tooltip>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ChatIcon sx={{ fontSize: 28, color: "white" }} />
        <Typography 
          variant="h6" 
          sx={{ 
            color: "white", 
            fontWeight: "bold",
            background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: { xs: "none", sm: "block" }
          }}
        >
          Talk-A-Tive
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledIconButton>
          <NotificationsIcon />
        </StyledIconButton>
        
        <StyledProfileButton
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          startIcon={<AccountCircleIcon />}
        >
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {user?.name?.split(' ')[0] || 'Profile'}
          </Typography>
        </StyledProfileButton>
        
        <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "profile-button",
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <ProfileModal user={user} handleClose={handleClose}>
            <MenuItem>
              <AccountCircleIcon sx={{ mr: 2 }} />
              My Profile
            </MenuItem>
          </ProfileModal>
          <Divider />
          <MenuItem onClick={handleLogOut}>
            <Typography sx={{ color: '#ff5252' }}>Logout</Typography>
          </MenuItem>
        </StyledMenu>
      </Box>
    </StyledHeader>
  );
};
