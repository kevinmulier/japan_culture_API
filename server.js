const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.MONGODB_URI;

const PORT = 8000;

const app = express();

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("japan-festivals");
    const festivalsCollection = db.collection("festivals");
    const artsCollection = db.collection("arts");
    const customsCollection = db.collection("customs");

    app.use(cors());

    app.listen(process.env.PORT || PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => console.error(error));
