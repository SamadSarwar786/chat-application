import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setSelectedChat } from "../../store/chatSlicer";
import { getSender } from "../../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import SingleChat from "./SingleChat";
import { styled } from "@mui/material/styles";
import { Chat as ChatIcon, Person as PersonIcon } from "@mui/icons-material";

const StyledChatBox = styled(Box)(({ theme }) => ({
  background: "transparent",
  color: "white",
  padding: "24px",
  borderRadius: "16px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
}));

const StyledChatHeader = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  marginBottom: "16px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
}));

const StyledBackButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  color: "white",
  marginRight: "12px",
  '&:hover': {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
}));

const StyledEmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.7)",
  gap: "16px",
}));

const ChatBox = () => {
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      {selectedChat ? (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <StyledChatHeader>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <StyledBackButton
                onClick={() => dispatch(setSelectedChat(null))}
                sx={{ display: { md: "none" } }}
              >
                <ArrowBackIcon />
              </StyledBackButton>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {selectedChat?.isGroupChat ? (
                  <ChatIcon sx={{ color: "white", fontSize: 24 }} />
                ) : (
                  <PersonIcon sx={{ color: "white", fontSize: 24 }} />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {selectedChat?.isGroupChat
                    ? selectedChat?.chatName
                    : getSender(user, selectedChat?.users).name}
                </Typography>
              </Box>
            </Box>

            <Box>
              {selectedChat?.isGroupChat ? (
                <UpdateGroupModal
                  key={selectedChat?.chatName}
                  selectedChat={selectedChat}
                  loggedInUser={user}
                />
              ) : (
                <ProfileModal
                  key={selectedChat?.chatName}
                  user={getSender(user, selectedChat?.users)}
                />
              )}
            </Box>
          </StyledChatHeader>
          
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <SingleChat user={user} selectedChat={selectedChat} />
          </Box>
        </Box>
      ) : (
        <StyledEmptyState>
          <ChatIcon sx={{ fontSize: 80, color: "rgba(255, 255, 255, 0.3)" }} />
          <Typography
            variant="h5"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            Welcome to Talk-A-Tive
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "16px",
            }}
          >
            Select a chat to start messaging
          </Typography>
        </StyledEmptyState>
      )}
    </>
  );
};

export default ChatBox;
