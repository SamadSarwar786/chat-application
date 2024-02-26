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
const ChatBox = () => {
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
console.log('inside chatBox', selectedChat?.chatName);
  return (
    <Box
      sx={{
        bgcolor: "white",
        color: "black",
        px: 2,
        py: 1,
        borderRadius: "10px",
        height: "100%",
      }}
    >
      {selectedChat ? (
        <Box sx={{ height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: "5px",
              paddingLeft: { xs: "0px", md: "10px" },
              borderRadius: "6px",
            }}
          >
            <IconButton
              onClick={() => dispatch(setSelectedChat(null))}
              sx={{ display: { md: "none" } }}
            >
              <ArrowBackIcon />
            </IconButton>
            {selectedChat?.isGroupChat ? (
              <>
                {selectedChat?.chatName.toUpperCase()}
                <UpdateGroupModal
                  key={selectedChat?.chatName}
                  selectedChat={selectedChat}
                  loggedInUser={user}
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat?.users).name.toUpperCase()}
                <ProfileModal
                  key={selectedChat?.chatName}
                  user={getSender(user, selectedChat?.users)}
                />
              </>
            )}
          </Box>
          <SingleChat user={user} selectedChat={selectedChat} />
        </Box>
      ) : (
        <Typography>click on user to start chatting</Typography>
      )}
    </Box>
  );
};

export default ChatBox;
