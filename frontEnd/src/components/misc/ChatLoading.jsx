import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

const UserLoading = () => {
  return (
    <Box
      sx={{
        px: "7px",
        py: "4px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Skeleton variant="rectangular" width={180} height={50} />
    </Box>
  );
};
const ChatLoading = () => {
  return (
    <Stack spacing={2}>
      <UserLoading />
      <UserLoading />
      <UserLoading />
      <UserLoading />
      <UserLoading />
      <UserLoading />
    </Stack>
  );
};

export default ChatLoading;
