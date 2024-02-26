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
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../store/userSlicer";
import ProfileModal from "./ProfileModal";

export const Header = ({ openDrawer,  }) => {

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "white",
        p: "5px 10px",
        border: "5px solid #d9d4d4",
        color: "black",
        height: "61px",
      }}
    >
      <Tooltip title="Search User to chat" placement="bottom-end">
        <Button
          size="sm"
          sx={{ color: "black", bgcolor: "#ebeff3" }}
          onClick={handleDrawer}
        >
          <i class="fa fa-search" aria-hidden="true"></i>
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: ".8rem",
              ml: 1,
            }}
          >
            Search
          </Typography>
        </Button>
      </Tooltip>

      <Typography>Talk-A-Tive</Typography>
      <Box>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <Button
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{ ml: 1 }}
        >
          <AccountCircleIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <ProfileModal user={user} handleClose={handleClose}>
            <MenuItem>My Profile</MenuItem> 
          </ProfileModal>
          <Divider />
          <MenuItem onClick={handleLogOut}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
