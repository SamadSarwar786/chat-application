import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllChats, setSelectedChat } from "../../store/chatSlicer";
import { getSender } from "../../config/ChatLogic";
import NewGroupModal from "./NewGroupModal";
import { useFetchDataQuery } from "../../store/Rtk/fetchAllChats";
export const MyChats = () => {
  const dispatch = useDispatch();
  const { chats, selectedChat, singleChatStatus, chatsStatus } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading, refetch } = useFetchDataQuery();

  console.log('data', data);

  // useEffect(() => {
  //   dispatch(fetchAllChats());
  // }, []);

  return (
    <Box
      sx={{
        bgcolor: "white",
        color: "black",
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mb: "20px",
          height: "6%",
        }}
      >
        <Typography variant="h6" sx={{ color: "GrayText" }}>
          My Chats
        </Typography>
        <NewGroupModal>
          <Button
            sx={{
              cursor: "pointer",
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
            New Group Chat
            <AddIcon />
          </Button>
        </NewGroupModal>
      </Box>
      <Box
        sx={{
          width: "100%",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pr: "10px",
          height: "calc(94% - 20px)",
        }}
      >
        {!isLoading ? (
          (data || []).map((chat) => (
            <Box
              onClick={() => dispatch(setSelectedChat(chat))}
              sx={{
                cursor: "pointer",
                bgcolor: `${selectedChat?._id === chat._id ? "#38b2ac" : "#e8e8e8"}`,
                color: `${selectedChat?._id === chat._id ? "white" : "black"}`,
                px: 2,
                py: 1,
                borderRadius: "6px",
              }}
            >
              <Typography>
                {chat.isGroupChat
                  ? chat.chatName
                  : getSender(user, chat.users).name}
              </Typography>
              <Typography>
                <b>
                  {(chat.latestMessage && chat.latestMessage?.sender.name) ||
                    "Salman Khan"}
                </b>{" "}
                {(chat.latestMessage && chat.latestMessage?.content) || "Hi"}
              </Typography>
            </Box>
          ))
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
