const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("new user connected");

  // for single connection (so, only for sender)
  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat app",
    createdAt: new Date().getTime()
  });

  // for all except sender
  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New user joined",
    createdAt: new Date().getTime()
  });

  socket.on("createMessage", message => {
    console.log("createMessage showed on server", message);

    //   //for all connections
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createAt: new Date().getTime()
    });

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
