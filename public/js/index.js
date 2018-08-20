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

  const li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  $("#messages").append(li);
});

// acknowledgements
socket.emit(
  "createMessage",
  {
    from: "Frank",
    text: "hi"
  },
  data => {
    console.log(data);
  }
);

$("#message-form").on("submit", e => {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $('input[name="message"]').val()
    },
    () => {}
  );
});
