import { Box, Drawer, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SideDrawer } from "../components/misc/SideDrawer";
import { MyChats } from "../components/misc/MyChats";
import ChatBox from "../components/misc/ChatBox";
import { Header } from "../components/misc/Header";
import { useNavigate } from "react-router-dom";
import { getUser, selectIsLoggedIn } from "../store/userSlicer";

const Chat = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const { chats, selectedChat, singleChatStatus, chatsStatus } = useSelector(
    (state) => state.chat
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user is not logged in
    if (!isLoggedIn) {
      // Navigate to the home page
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return <></>;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "pink",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header openDrawer={setIsOpen} />
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <SideDrawer onClose={() => setIsOpen(false)}/>
      </Drawer>
      <Box sx={{ p: "10px", height: "calc(100vh - 61px)" }}>
        <Grid sx={{ height: "100%" }} container spacing="10px">
          <Grid sx={{ height: "100%" , display: {xs :`${selectedChat ? 'none' : 'block'}` , md : 'block'} }} item xs={selectedChat ? 0:12} md={4}>
            <MyChats />
          </Grid>
          <Grid sx={{ height: "100%", display: {xs :`${selectedChat ? 'block' : 'none'}` , md : 'block'} }} item xs={selectedChat ? 12:0} md={8}>
            <ChatBox/>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Chat;
