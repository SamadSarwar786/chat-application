import React, { useEffect, useState } from "react";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useSelector } from "react-redux";
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
      navigate("/chat");
    }
    // Check if the user is not logged in
  }, [isLoggedIn, navigate]);

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <Container maxWidth="xl" sx={{ height: "100vh", alignItems: "center",alignContent:"center" }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            width: "400px",
            margin: "auto",
            color: "#fff",
            border: "1px solid #fff",
            justifyContent: "center",
            alignItems: "center",
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
            color: "#fff",
            border: "1px solid #fff",
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
                tabIndex === 0
                  ? {
                      border: "1px solid white",
                      backgroundColor: "rgba(255, 255, 255, .2)",
                      borderRadius: "10px",
                      color: "white !important",
                    }
                  : {
                      color: "white",
                    }
              }
              label="Login"
            />
            <Tab
              sx={
                tabIndex === 1
                  ? {
                      border: "1px solid white",
                      backgroundColor: "rgba(255, 255, 255, .2)",
                      borderRadius: "10px",
                      color: "white !important",
                    }
                  : {
                      color: "white",
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
    </Container>
  );
};

export default Home;
