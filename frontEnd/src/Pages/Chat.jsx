import { Box, Drawer, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SideDrawer } from "../components/misc/SideDrawer";
import { MyChats } from "../components/misc/MyChats";
import ChatBox from "../components/misc/ChatBox";
import { Header } from "../components/misc/Header";
import { useNavigate } from "react-router-dom";
import { getUser, selectIsLoggedIn } from "../store/userSlicer";
import { styled } from "@mui/material/styles";

const StyledChatContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>') repeat",
    opacity: 0.1,
    zIndex: 0,
  },
}));

const StyledChatGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  position: "relative",
  zIndex: 1,
}));

const StyledGridItem = styled(Grid)(({ theme , isSelected = false   }) => ({
  height: "100%",
  padding: "8px",
  "& > *": {
    height: "100%",
    background: !isSelected ? "rgba(255, 255, 255, 0.1)" : "transparent",
    backdropFilter: !isSelected ? "blur(20px)" : "none",
    border: !isSelected ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
    borderRadius: "16px",
    boxShadow: !isSelected ? "0 8px 32px rgba(0, 0, 0, 0.1)" : "none",
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0 16px 16px 0",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
}));

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
    <StyledChatContainer>
      <Header openDrawer={setIsOpen} />
      <StyledDrawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <SideDrawer onClose={() => setIsOpen(false)}/>
      </StyledDrawer>
      <Box sx={{ p: "16px", height: "calc(100vh - 77px)", position: "relative", zIndex: 1 }}>
        <StyledChatGrid sx={{ height: "100%" }} container spacing={2}>
          <StyledGridItem 
            isSelected={false}
            sx={{ 
              height: "100%", 
              display: {xs: `${selectedChat ? 'none' : 'block'}`, md: 'block'} 
            }} 
            item 
            xs={selectedChat ? 0 : 12} 
            md={4}
          >
            <MyChats />
          </StyledGridItem>
          <StyledGridItem 
            isSelected={selectedChat ? true : false}
            sx={{ 
              height: "100%", 
              display: {xs: `${selectedChat ? 'block' : 'none'}`, md: 'block'} 
            }} 
            item 
            xs={selectedChat ? 12 : 0} 
            md={8}
          >
            <ChatBox/>
          </StyledGridItem>
        </StyledChatGrid>
      </Box>
    </StyledChatContainer>
  );
};

export default Chat;
