import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { stringAvatar } from "./ScrollableChat";

const StyledUserListItem = styled(Box)(({ theme }) => ({
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  color: "white",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  padding: "12px 16px",
  transition: "all 0.3s ease",
  '&:hover': {
    background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
    border: "1px solid rgba(63, 81, 181, 0.3)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(63, 81, 181, 0.3)",
  },
  '&:active': {
    transform: "translateY(0px)",
    boxShadow: "0 4px 15px rgba(63, 81, 181, 0.2)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: "16px",
  width: 44,
  height: 44,
  border: "2px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  fontSize: "16px",
  fontWeight: "bold",
}));

const UserListItem = ({ user, handleFunction }) => {
  const handleSelect = () => {
    handleFunction && handleFunction();
  };

  return (
    <StyledUserListItem onClick={handleSelect}>
      <StyledAvatar 
        {...stringAvatar(user.name)}
        src={user.pic ? `${process.env.REACT_APP_BASE_URL}${user.pic}` : ""} 
        alt={user.name}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            color: "white",
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.name}
        </Typography>
        <Typography 
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "14px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.email}
        </Typography>
      </Box>
    </StyledUserListItem>
  );
};

export default UserListItem;
