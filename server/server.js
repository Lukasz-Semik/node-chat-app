const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("new user connected");
  console.log(generateMessage);
  // for single connection (so, only for sender)
  // socket.emit(
  //   "newMessage",
  //   generateMessage("Admin", "Welcome to the chat app")
  // );

  // for all except sender
  // socket.broadcast.emit(
  //   "newMessage",
  //   generateMessage("Admin", "New user joined")
  // );

  socket.on("join", (params, callback) => {
    // io.emit -> io.to('name of room').emit ---- to all in the room
    // socket.broadcast.emit -> socket.broadcost.to('name of room').emit ---- to all in room except sender
    // socket.emit ---- only sender
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("name and room are required");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    // for all except sender
    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", `${params.name} joined`));

    callback();
  });

  socket.on("createLocationMessage", coords => {
    // NIE JEST SKONCZONE, WALIC TO.
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      //for all connections
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
    }
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
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
