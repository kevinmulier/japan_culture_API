const express = require("express");
const cors = require("cors");

const PORT = 8000;

const app = express();

app.use(cors());

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running on port " + PORT);
});
