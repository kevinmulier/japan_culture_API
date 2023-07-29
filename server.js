const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.MONGODB_URI;

const PORT = 8000;

const app = express();

app.use(cors());

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running on port " + PORT);
});
