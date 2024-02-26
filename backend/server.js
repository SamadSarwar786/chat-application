const express = require("express");
const { chats } = require("./data/dummyData");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require('path');
dotenv.config();
connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());



app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });
// app.get("/api/chat/:id", (req, res) => {
//     // const cookie = req.cookies
//   const id = req.params.id;
//   const particularChat = chats.find((chat) => chat._id === id);
//   if (particularChat) res.send(particularChat);
//   else res.send({ message: "No chat found with this id" });
// });


// -------------------deployment---------------------
 
const dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(dirname1,'../frontEnd/build')));
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(dirname1,'../frontEnd/build/index.html'));
  })
}
else{
  app.get("/", (req, res) => {
    res.send("Home Page Api");
  });
}









// -------------------deployment---------------------

app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, console.log("app running on port 5000"));
// const io = Server(server, {});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.broadcast.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.broadcast.to(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});