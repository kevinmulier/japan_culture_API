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
      const { name, location, date, description } = req.body;

      if (!name || !location || !date || !description) {
        return res.status(400).json({ error: "Missing one or more properties." });
      }

      festivalsCollection
        .insertOne(req.body)
        .then((result) => {
          res.json({ message: "Festival created successfully." });
          res.redirect("/festivals");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while creating the festival." });
        });
    });

    app.get("/festivals/:id", (req, res) => {
      festivalsCollection
        .findOne({ _id: req.params.id })
        .then((results) => {
          res.render("festival.ejs", { festival: results });
        })
        .catch((error) => console.error(error));
    });

    app.put("/festivals/:id", (req, res) => {
      const { name, location, date, description } = req.body;

      if (!name || !location || !date || !description) {
        return res.status(400).json({ error: "Missing one or more properties." });
      }

      festivalsCollection
        .findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              name: name,
              location: location,
              date: date,
              description: description,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          if (result.lastErrorObject.updatedExisting) {
            res.json({ message: "Festival updated successfully." });
          } else {
            res.json({ message: "Festival created successfully.", id: result.lastErrorObject.upserted });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while updating the festival." });
        });
    });

    // DELETE /festivals/:id

    app.listen(process.env.PORT || PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => console.error(error));
