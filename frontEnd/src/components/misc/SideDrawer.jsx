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
    <Box
      sx={{
        p: "10px",
        minWidth: "250px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      direction="column"
    >
      <Typography sx={{ mt: 1 }}>Search Users</Typography>
      <Divider />
      <Box sx={{ display: "flex" }}>
        <OutlinedInput
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          variant="contained"
        />
        {/* <Button variant="contained">Go</Button> */}
      </Box>
      {searchStatus !== "loading" ? (
        <Stack
          sx={{ width: "100%" }}
          spacing={2}
          justifyContent="center"
          alignContent="center"
        >
          {searchResult.map((user, index) => (
            <UserListItem key={index} user={user} handleFunction={() => onUserListItemClickHandler(user)} />
          ))}
          {loadingChat && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </Stack>
      ) : (
        <ChatLoading />
      )}
    </Box>
  );
};
