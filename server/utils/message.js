const genarateMessage = (from, text) => ({
  from,
  text,
  createdAt: new Date().getTime()
});

module.exports = { genarateMessage };
