import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchUsers,
  resetSearch,
  setErrorMessage,
} from "../../store/userSlicer";
import UserListItem from "./UserListItem";
import { createNewGroup } from "../../store/chatSlicer";
import { useCreateGrpMutation } from "../../store/Rtk/fetchAllChats";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  // textAlign: "center",
};
const NewGroupModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const { searchResult, searchStatus } = useSelector((state) => state.auth);
  const [createGrp,{isLoading,isSuccess}] = useCreateGrpMutation();
  useEffect(() => {
    if (search === "") dispatch(resetSearch());
    else dispatch(fetchSearchUsers(search));
  }, [search]);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setGroupName("");
    setSearch("");
    setSelectedUsers([]);
  };

  const onSelectUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      dispatch(setErrorMessage("User Already Added"));
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const onDeSelectUser = (userToRemove) => {
    const filteredSelectedUsers = selectedUsers.filter(
      (user) => user._id !== userToRemove._id
    );
    setSelectedUsers(filteredSelectedUsers);
  };
  const handleSubmit = () => {
    if (selectedUsers.length < 2 || groupName === "") {
      dispatch(setErrorMessage("Please fill all the field"));
      return;
    }
    const payLoad = {
      name: groupName,
      users: JSON.stringify(selectedUsers),
    };
    // dispatch(createNewGroup(payLoad));
    createGrp(payLoad);
    closeModal();
  };

  console.log("name", searchResult, searchStatus);
  return (
    <>
      <span onClick={openModal}>{children}</span>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            sx={{
              position: "absolute",
              top: "3%",
              right: "1%",
            }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            align="center"
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            Create Group Chat
          </Typography>
          <Box
            sx={{
              pt: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TextField
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter Group Name"
            />
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Add User eg: Jhon Piyush"
            />
            <Stack direction="row" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <Chip
                  label={user.name}
                  avatar={<Avatar>{user.name.slice(0, 1)}</Avatar>}
                  onDelete={() => onDeSelectUser(user)}
                  sx={{ ml: "3px", mb: "3px" }}
                />
              ))}
            </Stack>
            {searchStatus === "loading" ? (
              <Typography align="center">Loading...</Typography>
            ) : (
              searchResult
                ?.slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => onSelectUser(user)}
                  />
                ))
            )}
            <Button
              variant="contained"
              sx={{
                cursor: "pointer",
                color: "black",
                bgcolor: "#e8e8e8",
                "&:hover": {
                  bgcolor: "#38B2AC",
                  color: "white",
                },
                borderRadius: "6px",
                width: "max-content",
                alignSelf: "center",
              }}
              onClick={handleSubmit}
            >
              Create Group
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewGroupModal;
