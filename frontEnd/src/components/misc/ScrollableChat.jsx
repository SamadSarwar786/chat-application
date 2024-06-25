import { Avatar, Tooltip } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isDifferentSender,
  isSameSenderMargin,
  isSenderUserSame,
} from "../../config/ChatLogic";
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

function stringAvatar(name) {
  const [firstName='', lastName=''] = name.split(" ");
  console.log('firstName',firstName, lastName);
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${firstName[0]}${lastName ? lastName[0] : ''}`,
  };
}
const ScrollableChat = ({ messages, user }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isDifferentSender(messages, m, i) ||
              isLastMessage(messages, i)) &&
              isSenderUserSame(m, user) === false && (
                <Tooltip title={m.sender.name} placement="bottom-end" arrow>
                  <Avatar
                    {...stringAvatar(m.sender.name)}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={user.pic ? `${process.env.REACT_APP_BASE_URL}${user.pic}` : ""} alt="userPic"
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: 3,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
