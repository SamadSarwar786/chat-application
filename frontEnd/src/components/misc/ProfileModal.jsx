import { Box, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  textAlign:'center'
};
const ProfileModal = ({ user, children, handleClose }) => {
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    if (handleClose) handleClose();
  };
  return (
    <>
      {children ? (
        <span onClick={openModal}>{children}</span>
      ) : (
        <IconButton onClick={openModal}>
          <VisibilityIcon />
        </IconButton>
      )}
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
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{fontWeight:'bold'}}>
            {user && (user.name || '')}
          </Typography>
          <Typography id="modal-modal-description" variant="h5" sx={{ color:"#c5c4c4", fontWeight:'100' }}>
           Email : {user && (user.email || '')}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
