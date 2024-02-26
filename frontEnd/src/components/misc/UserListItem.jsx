import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { fetchSelectedChat } from "../../store/chatSlicer";

const UserListItem = ({ user, handleFunction }) => {
  const dispatch = useDispatch();

  const handleSelect = () => {
    if (handleFunction){
      handleFunction();
    }
    // dispatch(fetchSelectedChat(user._id));
  };

  return (
    <Box
      onClick={handleSelect}
      sx={{
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        color: "black",
        bgcolor: "#e8e8e8",
        "&:hover": {
          bgcolor: "#38B2AC",
          color: "white",
        },
        px: "7px",
        py: "4px",
        borderRadius: "6px",
      }}
    >
      <Avatar sx={{ mr: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography>{user.name}</Typography>
        <Typography variant="subtitle2">
          <b>Email : </b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
