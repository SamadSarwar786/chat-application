import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
const UserListItem = ({ user, handleFunction }) => {

  const handleSelect = () => {
    handleFunction && handleFunction();
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
      <Avatar sx={{ mr: 2 }} src={user.pic ? `${process.env.REACT_APP_BASE_URL}${user.pic}` : ""} alt="userPic" />
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
