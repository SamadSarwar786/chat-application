import React, { useEffect, useState } from "react";
import { Box, Container, Tab, Tabs, Typography, Paper, Card, CardContent } from "@mui/material";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsLoggedIn } from "../store/userSlicer";
import { styled } from "@mui/material/styles";
import { Chat as ChatIcon, Message as MessageIcon } from "@mui/icons-material";

const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
  maxWidth: "450px",
  width: "100%",
  position: "relative",
  zIndex: 1,
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "32px 24px 24px",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
  borderRadius: "24px 24px 0 0",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  padding: "0 24px",
  marginTop: "16px",
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTabs-flexContainer": {
    gap: "8px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  flex: 1,
  borderRadius: "16px",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "16px",
  height: "48px",
  minHeight: "48px",
  color: "rgba(255, 255, 255, 0.7)",
  transition: "all 0.3s ease",
  "&.Mui-selected": {
    background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(63, 81, 181, 0.3)",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
}));

function TabPanel({ children, value, index }) {
  return <>{value === index && <CardContent sx={{ p: 0 }}>{children}</CardContent>}</>;
}

const Home = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, [isLoggedIn, navigate]);

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <StyledContainer maxWidth={false} disableGutters>
      <StyledCard>
        <HeaderBox>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <ChatIcon sx={{ fontSize: 40, color: "#3f51b5", mr: 1 }} />
            <MessageIcon sx={{ fontSize: 35, color: "#2196f3", ml: 1 }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "white", 
              fontWeight: "bold", 
              mb: 1,
              background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Talk-A-Tive
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.8)", 
              fontWeight: "medium" 
            }}
          >
            Connect • Chat • Share
          </Typography>
        </HeaderBox>

        <StyledTabs
          value={tabIndex}
          onChange={handleChange}
          variant="fullWidth"
        >
          <StyledTab label="Sign In" />
          <StyledTab label="Sign Up" />
        </StyledTabs>

        <TabPanel value={tabIndex} index={0}>
          <Login />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <SignUp />
        </TabPanel>
      </StyledCard>
    </StyledContainer>
  );
};

export default Home;
