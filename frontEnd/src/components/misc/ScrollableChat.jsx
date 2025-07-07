import { Avatar, Tooltip, Box, Typography } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isDifferentSender,
  isSameSenderMargin,
  isSenderUserSame,
} from "../../config/ChatLogic";
import { styled } from "@mui/material/styles";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  const [firstName = '', lastName = ''] = name.split(" ");
  return {
    sx: {
      bgcolor: stringToColor(name),
      border: '2px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
    children: `${firstName[0]}${lastName ? lastName[0] : ''}`,
  };
}

const MessageContainer = styled(Box)(({ theme, isOwn }) => ({
  display: "flex",
  alignItems: "flex-end",
  marginBottom: "12px",
  gap: "8px",
  justifyContent: isOwn ? "flex-end" : "flex-start",
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  background: isOwn 
    ? "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)"
    : "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${isOwn ? 'rgba(63, 81, 181, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
  borderRadius: isOwn ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
  padding: "12px 16px",
  maxWidth: "70%",
  minWidth: "60px",
  color: "white",
  fontSize: "14px",
  lineHeight: "1.4",
  wordBreak: "break-word",
  boxShadow: isOwn 
    ? "0 4px 15px rgba(63, 81, 181, 0.3)"
    : "0 4px 15px rgba(0, 0, 0, 0.1)",
  transition: "all 0.2s ease",
  position: "relative",
  '&:hover': {
    transform: "translateY(-1px)",
    boxShadow: isOwn 
      ? "0 6px 20px rgba(63, 81, 181, 0.4)"
      : "0 6px 20px rgba(255, 255, 255, 0.1)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  fontSize: '14px',
  fontWeight: 'bold',
}));

const ScrollableChat = ({ messages, user }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwn = m.sender._id === user._id;
          const showAvatar = (isDifferentSender(messages, m, i) ||
            isLastMessage(messages, i)) && !isOwn;
          
          return (
            <MessageContainer key={m._id} isOwn={isOwn}>
              {showAvatar && (
                <Tooltip 
                  title={m.sender.name} 
                  placement="bottom-start" 
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px',
                      },
                    },
                    arrow: {
                      sx: {
                        color: 'rgba(0, 0, 0, 0.8)',
                      },
                    },
                  }}
                >
                  <StyledAvatar
                    {...stringAvatar(m.sender.name)}
                    src={
                      m.sender.pic 
                        ? `${process.env.REACT_APP_BASE_URL}${m.sender.pic}`
                        : ""
                    }
                    alt={m.sender.name}
                  />
                </Tooltip>
              )}
              
              <MessageBubble 
                isOwn={isOwn}
                sx={{
                  marginLeft: !isOwn && !showAvatar ? "44px" : "0px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    margin: 0,
                  }}
                >
                  {m.content}
                </Typography>
              </MessageBubble>
            </MessageContainer>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
