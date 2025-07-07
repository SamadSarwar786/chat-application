import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import {
  useGetAllMessagesQuery,
  useSendMessageMutation,
} from "../../store/Rtk/fetchAllChats";
import ScrollableChat from "./ScrollableChat";
import SendIcon from "@mui/icons-material/Send";
import Lottie from "react-lottie";
import typingAnimationData from "../../animation/typing.json";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../store/chatSlicer";
import { styled } from "@mui/material/styles";
const io = require("socket.io-client");
var socket, selectedChatCompare;
let typingTimer;

const StyledChatContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  background: "transparent",
  padding: "0px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));

const StyledMessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "16px",
  overflowY: "auto",
  height: "100%",
  minHeight: "200px",
  maxHeight: "calc(100vh - 300px)",
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

const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  '& .MuiCircularProgress-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const StyledMessageInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(63, 81, 181, 0.5)',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    fontSize: '16px',
    padding: '10px 16px',
    lineHeight: '1.5',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
  },
  '& .MuiInputAdornment-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
}));

const StyledSendButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
  color: 'white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  margin: '0 4px',
  boxShadow: '0 4px 15px rgba(63, 81, 181, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #303f9f 0%, #1976d2 100%)',
    boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const TypingContainer = styled(Box)(({ theme }) => ({
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  display: 'inline-block',
  marginBottom: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const SingleChat = ({ user, selectedChat }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const {
    data: AllMessages = [],
    isLoading: messagesLoading,
    refetch,
  } = useGetAllMessagesQuery(selectedChat?._id, { skip: !selectedChat });
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { notification } = useSelector((state) => state.chat);

  useEffect(() => {
    if (AllMessages.length > 0) setMessages(AllMessages);
  }, [AllMessages]);

  const ENDPOINT = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user._id);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    refetch();
    socket.emit("join chat", selectedChat._id);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  if (socket) {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          dispatch(addNotification(newMessageRecieved));
          refetch();
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
      return;
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 4000);
  };

  const onBlurHandler = () => {
    if (typing) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  };

  const sendMessageHandler = async () => {
    if (newMessage.trim()) {
      const payLoad = {
        content: newMessage,
        chatId: selectedChat._id,
      };
      try {
        const { data } = await sendMessage(payLoad);
        setNewMessage("");
        socket.emit("new message", data);
        socket.emit("stop typing", selectedChat._id);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  if (!socketConnected) return null;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <StyledChatContainer>
      <StyledMessagesContainer>
        {messagesLoading ? (
          <StyledLoadingContainer>
            <CircularProgress size={40} />
          </StyledLoadingContainer>
        ) : (
          <>
            <ScrollableChat user={user} messages={messages} />
            {isTyping && (
              <TypingContainer>
                <Lottie
                  options={defaultOptions}
                  width={60}
                  height={30}
                  style={{ margin: 0 }}
                />
              </TypingContainer>
            )}
          </>
        )}
      </StyledMessagesContainer>

      <Box 
        sx={{ 
          display: "flex", 
          gap: 1, 
          alignItems: "flex-end",
          flexShrink: 0,
          minHeight: "60px",
          padding: "8px 0",
        }}
      >
        <StyledMessageInput
          onChange={typingHandler}
          onKeyDown={handleKeyDown}
          onBlur={onBlurHandler}
          value={newMessage}
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          multiline
          maxRows={3}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                ) : (
                  <StyledSendButton
                    onClick={sendMessageHandler}
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </StyledSendButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </StyledChatContainer>
  );
};

export default memo(SingleChat);
