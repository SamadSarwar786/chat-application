import {
  Box,
  CircularProgress,
  Divider,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchUsers, resetSearch } from "../../store/userSlicer";
import { useFetchSelectedChatMutation } from "../../store/Rtk/fetchAllChats";
import { styled } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";

const StyledSideDrawer = styled(Box)(({ theme }) => ({
  padding: "20px",
  minWidth: "280px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  background: "transparent",
  color: "white",
  height: "100vh",
  overflow: "hidden",
}));

const StyledSearchInput = styled(OutlinedInput)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
    fontSize: '16px',
    padding: '12px 16px',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '2px solid rgba(63, 81, 181, 0.5)',
  },
}));

const StyledSearchResults = styled(Stack)(({ theme }) => ({
  width: "100%",
  flex: 1,
  overflowY: "auto",
  paddingRight: "8px",
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    margin: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)',
      boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
      transform: 'scaleX(1.2)',
    },
    '&:active': {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.4) 100%)',
    },
  },
}));

export const SideDrawer = ({onClose}) => {
  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [fetchSelectedChat] = useFetchSelectedChatMutation();
  const dispatch = useDispatch();
  const { searchResult, searchStatus } = useSelector((state) => state.auth);
  // /api/user?search=piyush
  // const fetchUsers = async () => {
  //   const uri = SEARCH_USERS + "?search=" + search;
  //   setIsLoading(true);
  //   try {
  //     const { data } = await axios.get(uri);
  //     if (data && data.length > 0) {
  //       setSearchResult(data);
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    if (search === "") dispatch(resetSearch());
    else dispatch(fetchSearchUsers(search));
  }, [search]);

  const onUserListItemClickHandler = (user) => {
    fetchSelectedChat({userId:user._id});
    onClose && onClose();
  }
  return (
    <StyledSideDrawer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 28 }} />
        <Typography 
          variant="h6" 
          sx={{ 
            color: "white", 
            fontWeight: "bold",
            fontSize: "18px" 
          }}
        >
          Search Users
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 1 }} />
      
      <Box sx={{ display: "flex" }}>
        <StyledSearchInput
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          placeholder="Search by name or email..."
        />
      </Box>
      
      {searchStatus !== "loading" ? (
        <StyledSearchResults
          spacing={1}
          justifyContent="flex-start"
          alignContent="flex-start"
        >
          {searchResult.map((user, index) => (
            <UserListItem 
              key={index} 
              user={user} 
              handleFunction={() => onUserListItemClickHandler(user)} 
            />
          ))}
          {loadingChat && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </Box>
          )}
        </StyledSearchResults>
      ) : (
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ChatLoading />
        </Box>
      )}
    </StyledSideDrawer>
  );
};
