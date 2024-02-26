const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { populate } = require("dotenv");

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    // console.log("userID not sent with request");
    res.status(400);
    throw new Error("userID not sent with request");
  }

  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (chat.length > 0) {
    // console.log("chat", chat[0]);
    res.send(chat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      createdChat.populate("users", "-password");
      // console.log("createdChat", createdChat);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(201).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error("not found and unable to create chat");
    }
  }
});
const fetchChats = expressAsyncHandler(async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .populate("groupAdmin", "name email")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (!chats || chats.length === 0) {
    res.status(404);
    throw new Error("No chats found");
  }

  res.send(chats);
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  let { users, name } = req.body;
  if (!users || !name) {
    return res.status(400).send({ message: "Please fill all the fileds" });
  }
  users = JSON.parse(users);
  console.log("after data", users, name);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than two users are requied to create group" });
  }
  users.push(req.user._id);
  try {
    const createdGroupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chat.findOne({ _id: createdGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.send(fullGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, newChatName } = req.body;
  if (!chatId || !newChatName) {
    return res.status(400).send({ message: "Please fill all the fileds" });
  }
  try {
    const updateGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: newChatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updateGroup) {
      res.status(404);
      throw new Error("Chat Not Found");
    }
    res.send(updateGroup);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    res.status(400).send({ message: "Please fill all the field" });
  }
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, users: { $ne: userId } },
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found or user already exist in the group");
    }
    res.send(chat);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    res.status(400).send({ message: "Please fill all the field" });
  }
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, users: { $eq: userId } },
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found or user not exist in the group");
    }
    res.send(chat);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const updateTheGroup = expressAsyncHandler(async (req, res) => {
  let { name, users, chatId } = req.body;
  if (!chatId) {
    res.status(400).send({ message: "Please fill all the field" });
  }
  users = JSON.parse(users);
  users.push(req.user._id);
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        chatName: name,
        users,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found or user not exist in the group");
    }
    res.send(chat);
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ message: error.message });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  updateTheGroup,
};
