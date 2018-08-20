const socket = io();

socket.on("connect", () => {
  console.log("connected to server");

  // socket.emit("createMessage", {
  //   to: "jen@yo.com",
  //   text: "I am from client!"
  // });
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("newMessage", message => {
  console.log("newMessage received on client", message);
});
