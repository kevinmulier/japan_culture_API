const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

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

    app.set("view engine", "ejs");

    app.use(express.static("public"));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      res.render("index.ejs");
    });

    app.get("/festivals", (req, res) => {
      const cursor = festivalsCollection
        .find()
        .toArray()
        .then((results) => {
          res.render("festivals.ejs", { festivals: results });
        })
        .catch((error) => console.error(error));
    });

    app.post("/festivals", (req, res) => {
      festivalsCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/festivals");
        })
        .catch((error) => console.error(error));
    });

    // POST /festivals

    // GET /festivals/:id

    // PUT /festivals/:id

    // DELETE /festivals/:id

    app.listen(process.env.PORT || PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => console.error(error));
