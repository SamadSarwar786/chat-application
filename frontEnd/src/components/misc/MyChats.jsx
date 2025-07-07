import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllChats, setSelectedChat } from "../../store/chatSlicer";
import { getSender } from "../../config/ChatLogic";
import NewGroupModal from "./NewGroupModal";
import { useFetchDataQuery } from "../../store/Rtk/fetchAllChats";
import { stringAvatar } from "./ScrollableChat";
import { styled } from "@mui/material/styles";
import { Group as GroupIcon } from "@mui/icons-material";

const StyledChatsContainer = styled(Box)(({ theme }) => ({
  background: "transparent",
  color: "white",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "16px",
  height: "100%",
  width: "100%",
  position: "relative",
}));

const StyledNewGroupButton = styled(Button)(({ theme }) => ({
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

const StyledChatItem = styled(Box)(({ theme, selected }) => ({
  cursor: "pointer",
  background: selected 
    ? "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)" 
    : "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow: selected 
    ? "0 4px 15px rgba(63, 81, 181, 0.3)" 
    : "0 2px 10px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  '&:hover': {
    background: selected 
      ? "linear-gradient(135deg, #303f9f 0%, #1976d2 100%)" 
      : "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px)",
    boxShadow: selected 
      ? "0 6px 20px rgba(63, 81, 181, 0.4)" 
      : "0 4px 15px rgba(255, 255, 255, 0.1)",
  },
}));

const StyledScrollContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  paddingRight: "8px",
  height: "calc(100% - 80px)",
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.5)',
    },
  },
}));

export const MyChats = () => {
  const dispatch = useDispatch();
  const { chats, selectedChat, singleChatStatus, chatsStatus } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading, refetch } = useFetchDataQuery();

  // useEffect(() => {
  //   dispatch(fetchAllChats());
  // }, []);

  return (
    <StyledChatsContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mb: 3,
          height: "60px",
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: "white", 
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          My Chats
        </Typography>
        <NewGroupModal>
          <StyledNewGroupButton
            startIcon={<GroupIcon />}
            endIcon={<AddIcon />}
          >
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              New Group
            </Typography>
          </StyledNewGroupButton>
        </NewGroupModal>
      </Box>
      
      <StyledScrollContainer>
        {!isLoading ? (
          (data || []).map((chat) => (
            <StyledChatItem
              key={chat._id}
              selected={selectedChat?._id === chat._id}
              onClick={() => {
                dispatch(setSelectedChat(chat));
                refetch();
              }}
            >
              <Avatar
                {...stringAvatar(chat.isGroupChat ? chat.chatName : chat.users[1].name)}
                src={
                  chat.users[1].pic && !chat.isGroupChat
                    ? `${process.env.REACT_APP_BASE_URL}${chat.users[1].pic}`
                    : ""
                }
                alt="userPic"
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(user, chat.users).name}
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
                  {chat.latestMessage ? (
                    <>
                      <strong>{chat.latestMessage.sender.name}: </strong>
                      {chat.latestMessage.content}
                    </>
                  ) : (
                    "No messages yet"
                  )}
                </Typography>
              </Box>
            </StyledChatItem>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "16px",
              }}
            >
              Loading chats...
            </Typography>
          </Box>
        )}
      </StyledScrollContainer>
    </StyledChatsContainer>
  );
};
