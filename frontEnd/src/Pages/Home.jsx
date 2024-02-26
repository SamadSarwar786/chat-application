import React, { useEffect, useState } from "react";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsLoggedIn } from "../store/userSlicer";

function TabPanel({ children, value, index }) {
  return <>{value === index && children}</>;
}
const Home = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      // Navigate to the home page
      navigate('/chat');
    }
    // Check if the user is not logged in
  }, [isLoggedIn, navigate]);



  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          width: "400px",
          margin: "auto",
          backgroundColor: "#ffffff",
          justifyContent: "center",
          p: "10px",
          borderRadius: "6px",
        }}
      >
        <Typography>Talk-A-Tive</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          margin: "auto",
          backgroundColor: "#ffffff",
          justifyContent: "center",
          p: "10px",
          borderRadius: "6px",
          marginTop: "10px",
        }}
      >
        <Tabs
          indicatorColor="secondary"
          variant="fullWidth"
          value={tabIndex}
          onChange={handleChange}
          sx={{
            ".MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            sx={
              tabIndex === 0 && {
                backgroundColor: "#e2f2ff",
                color: "grey !important",
                borderRadius: "10px",
              }
            }
            label="Login"
          />
          <Tab
            sx={
              tabIndex === 1 && {
                backgroundColor: "#e2f2ff",
                color: "grey !important",
                borderRadius: "10px",
              }
            }
            label="Sign Up"
          />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          <Login />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <SignUp />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Home;
