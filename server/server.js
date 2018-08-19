const path = require("path");
const express = require("express");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 8000;
const app = express();

app.use(express.static(publicPath));

app.listen(8000, () => {
  console.log(`on ${port}`);
});
