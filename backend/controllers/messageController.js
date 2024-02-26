const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    res.send({
      status: "fail",
      message: "content and chatId both are required",
    });
    return;
  }
  const newMessage = {
    sender: req.user._id,
    chat: chatId,
    content: content,
  };

  try {
    var message = await Message.create(newMessage);
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    message = await message.populate("sender", "name email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    res.send(message);
  } catch (error) {
    return res.send({
      status: "fail",
      message: "message not send",
    });
  }
};

const allMessages = async (req, res) => {
  if (!req.params.chatId) {
    return res.send({
      status: "fail",
      message: "chatId is required",
    });
  }
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");

    res.send(messages);
  } catch (error) {
    res.send({
      status: "fail",
      message: "No chat found with this id",
    });
  }
};

module.exports = { sendMessage, allMessages };
