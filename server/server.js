const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("new user connected");
  console.log(generateMessage);
  // for single connection (so, only for sender)
  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app")
  );

  // for all except sender
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined")
  );

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage showed on server", message);

    //for all connections
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();

    // to everyone, except sender
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createAt: new Date().getTime()
    // });
  });

  //   // for single connection (so, only for sender)
  // socket.emit("newMessage", {
  //   from: "John",
  //   text: "I am sent from server",
  //   createdAt: 123
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
