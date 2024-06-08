export function getSender(loggedInUser, users) {
  return loggedInUser._id === users[0]._id ? users[1] : users[0];
}

export const isUserMessage = (messages, m, i, userId) => {
  return m.sender._id === userId;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return '43px';
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return '3px';
  else return "auto";
};

export const isDifferentSender = (messages, m, i) => {
  return i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id;
};

export const isLastMessage = (messages, i) => {
  return i === messages.length - 1;
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const isSenderUserSame = (m, user) => {
  return m.sender._id === user._id;
};
