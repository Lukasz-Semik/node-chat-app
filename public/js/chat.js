const socket = io();

const scrollToBottom = () => {
  // selectors
  const messages = $("#messages");
  const newMessage = messages.children("li:last-child");
  // heights
  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on("connect", () => {
  const params = $.deparam(window.location.search);

  socket.emit("join", params, err => {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("no error");
    }
  });
  // socket.emit("createMessage", {
  //   to: "jen@yo.com",
  //   text: "I am from client!"
  // });
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("updateUserList", users => {
  const ol = $("<ol></ol>");

  users.forEach(user => {
    ol.append($("<li></li>").text(user));
  });

  $("#users").html(ol);
});

socket.on("newMessage", message => {
  const template = $("#message-template").html();
  const formattedTime = moment(message.createdAt).format("h:mm a");
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
  // const formattedTime = moment(message.createdAt).format("h:mm a");
  // const li = $("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // $("#messages").append(li);
});

socket.on("newLocationMessage", message => {
  const template = $("#location-message-template").html();
  const formattedTime = moment(message.createdAt).format("h:mm a");
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
  // var li = $("<li></li>");
  // var a = $('<a target="_blank">My current location</a>');
  // const formattedTime = moment(message.createdAt).format("h:mm a");

  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr("href", message.url);
  // li.append(a);
  // $("#messages").append(li);
});

// acknowledgements
// socket.emit(
//   "createMessage",
//   {
//     from: "Frank",
//     text: "hi"
//   },
//   data => {
//     console.log(data);
//   }
// );

$("#message-form").on("submit", e => {
  e.preventDefault();

  const messageTextbox = $('input[name="message"]');
  socket.emit(
    "createMessage",
    {
      text: messageTextbox.val()
    },
    () => {
      messageTextbox.val("");
    }
  );
});

const locationButton = $("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("No geolocation");
  }

  locationButton.attr("disabled", "disabled").text("Sending...");

  navigator.geolocation.getCurrentPosition(
    position => {
      locationButton.removeAttr("disabled").text("Send Location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    () => {
      locationButton.removeAttr("disabled").text("Send Location");
      alert("faile fetching location");
    }
  );
});
