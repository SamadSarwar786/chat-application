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
const io = require("socket.io-client");
var socket, selectedChatCompare;

const SingleChat = ({ user, selectedChat }) => {
  const [newMessage, setNewMessage] = useState("");
  console.log("newMessage", newMessage);
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
    setMessages(AllMessages);
  }, [AllMessages]);
  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      console.log("inside on Typing");
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      console.log("inside on stopTyping");
      setIsTyping(false);
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
    };

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    refetch();
    socket.emit("join chat", selectedChat._id);
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  console.log("notification", notification);
  if (socket) {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
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
  let typingTimer;
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
      return;
    }
    // setNewMessage(e.currentTarget.value);
    // console.log('data', e.target.value);
    // clearTimeout(typingTimer);
    // if (!socketConnected) return;
    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", selectedChat._id);
    // }
  };
  // const handleKeyUp = (e) => {
  //   typingTimer = setTimeout(() => {
  //     console.log("inside on setTimeOut for setting stop typing");
  //     setTyping(false);
  //     socket.emit("stop typing", selectedChat._id);
  //   }, 3000);
  // };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        console.log("inside on setTimeOut");
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // create a typing handler function that after 3 seconds will emit a stop typing event if user is not typing
  // and emit a typing event if user is typing

  const sendMessageHandler = async (e) => {
    console.log("inside sendMessageHandler", newMessage);
    if (newMessage) {
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
  if (!socketConnected) return;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Box
      sx={{
        height: "calc(100% - 50px)",
        backgroundColor: "lightgray",
        py: "5px",
        px: "10px",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {messagesLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ScrollableChat user={user} messages={messages} />
      )}
      <>
        {isTyping && (
          <div>
            <Lottie
              options={defaultOptions}
              width={70}
              height={40}
              style={{ margin: 0 }}
            />
          </div>
        )}
        <TextField
          onChange={typingHandler}
          onKeyDown={handleKeyDown}
          // onKeyUp={handleKeyUp}
          margin="dense"
          value={newMessage}
          fullWidth
          placeholder="Enter a message"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <IconButton
                    onClick={sendMessageHandler}
                    // onMouseDown={handleMouseDownPassword}
                  >
                    <SendIcon color="primary" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </>
    </Box>
  );
};

export default memo(SingleChat);
