import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputBase,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";
import EditOffIcon from "@mui/icons-material/EditOff";
import {
  fetchSearchUsers,
  resetSearch,
  setErrorMessage,
} from "../../store/userSlicer";
import { createNewGroup } from "../../store/chatSlicer";
import EditIcon from "@mui/icons-material/Edit";
import {
  useLeaveGrpMutation,
  useUpdateGrpMutation,
} from "../../store/Rtk/fetchAllChats";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const UpdateGroupModal = ({ selectedChat, loggedInUser }) => {
  const users = selectedChat?.users.filter(
    (user) => user._id !== loggedInUser._id
  );
  const [selectedUsers, setSelectedUsers] = useState(users || []);

  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(selectedChat.chatName || "");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { searchResult, searchStatus } = useSelector((state) => state.auth);
  const [isEditting, setIsEditting] = useState(false);

  const [updateGrp, { isLoading }] = useUpdateGrpMutation();
  const [leaveGrp, { isLoading: loading }] = useLeaveGrpMutation();

  const isAdmin = loggedInUser._id === selectedChat?.groupAdmin._id;
  useEffect(() => {
    if (search === "") dispatch(resetSearch());
    else dispatch(fetchSearchUsers(search));
  }, [search]);

  useEffect(() => {}, [selectedChat?._id]);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setGroupName(selectedChat?.chatName);
    setSearch("");
    setSelectedUsers(selectedChat?.users);
    setIsEditting(false);
  };

  const canPerformAction = () => {
    !isAdmin && dispatch(setErrorMessage("Only admin can delete the user"));
    console.log("canPerformAction", isAdmin);
    return isAdmin;
  };

  const onSelectUser = (userToAdd) => {
    if (!canPerformAction()) return;

    if (selectedUsers.includes(userToAdd)) {
      dispatch(setErrorMessage("User Already Added"));
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const onDeSelectUser = (userToRemove) => {
    if (!canPerformAction()) return;

    const filteredSelectedUsers = selectedUsers.filter(
      (user) => user._id !== userToRemove._id
    );
    setSelectedUsers(filteredSelectedUsers);
  };
  const handleUpdate = async () => {
    if (!canPerformAction()) return;
    if (selectedUsers.length < 2 || groupName === "") {
      dispatch(setErrorMessage("Please fill all the field"));
      return;
    }
    const payLoad = {
      name: groupName,
      users: JSON.stringify(selectedUsers),
      chatId: selectedChat?._id,
    };
    await updateGrp(payLoad);
    !isLoading && closeModal();
  };

  const handelEdit = () => {
    console.log("editing");

    if (isEditting) {
      setGroupName(selectedChat?.chatName);
      setSearch("");
      setSelectedUsers(selectedChat?.users);
    }
    setIsEditting(!isEditting);
  };

  const handleLeaveGroup = async() => {
    await leaveGrp({ userId: loggedInUser._id, chatId: selectedChat?._id });
    !loading && closeModal();
  };

  return (
    <>
      <IconButton onClick={openModal}>
        <VisibilityIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            pt: isEditting ? 7 : 4,
            px: 3,
            pb: 3,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
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

          <IconButton
            sx={{
              position: "absolute",
              top: "3%",
              left: "1%",
            }}
            onClick={handelEdit}
          >
            {isEditting ? <EditOffIcon /> : <EditIcon />}
          </IconButton>
          {!isEditting ? (
            <Typography align="center" id="modal-modal-title" variant="h5">
              {groupName.toUpperCase() || ""}
            </Typography>
          ) : (
            <TextField
              value={groupName.toUpperCase() || ""}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Update Group Name"
            />
          )}

          <Box
            sx={{
              pt: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Stack direction="row" flexWrap="wrap">
              {selectedUsers.map((user) =>
                isEditting ? (
                  <Chip
                    label={user.name}
                    avatar={<Avatar>{user.name.slice(0, 1)}</Avatar>}
                    onDelete={() => onDeSelectUser(user)}
                    color={
                      selectedChat?.groupAdmin._id === user._id
                        ? "primary"
                        : "secondary"
                    }
                    sx={{ ml: "3px", mb: "3px" }}
                  />
                ) : (
                  <Chip
                    label={user.name}
                    avatar={<Avatar>{user.name.slice(0, 1)}</Avatar>}
                    color={
                      selectedChat?.groupAdmin._id === user._id
                        ? "primary"
                        : "secondary"
                    }
                    sx={{ ml: "3px", mb: "3px" }}
                  />
                )
              )}
            </Stack>
            {isEditting && (
              <>
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Add User eg: Jhon Piyush"
                />
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
                  }}
                  onClick={handleUpdate}
                >
                  Update the Group
                </Button>
              </>
            )}
            <Button
              onClick={handleLeaveGroup}
              variant="contained"
              color="error"
            >
              Leave the Group
            </Button>
          </Box>
          {(isLoading || loading) && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
