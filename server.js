const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
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

    app.use(express.static("public"));
    app.use(cors());
    app.use(express.json());

    app.get("/", (req, res) => {
      res.render("index.ejs");
    });

    // FESTIVALS

    app.get("/festivals", (req, res) => {
      festivalsCollection
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
          console.log("Festival created successfully.");
          res.json({ message: "Festival created successfully.", id: result.insertedId });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while creating the festival." });
        });
    });

    app.get("/festivals/:id", (req, res) => {
      festivalsCollection
        .findOne({ _id: new ObjectId(req.params.id) })
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
          { _id: new ObjectId(req.params.id) },
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

    app.delete("/festivals/:id", (req, res) => {
      festivalsCollection
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((results) => {
          if (results.deletedCount === 0) {
            return res.json("No festival to delete");
          }
          res.json("Festival removed successfully.");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while removing the festival." });
        });
    });

    // ARTS

    app.get("/arts", (req, res) => {
      artsCollection
        .find()
        .toArray()
        .then((results) => {
          res.render("arts.ejs", { arts: results });
        })
        .catch((error) => console.error(error));
    });

    app.post("/arts", (req, res) => {
      const { name, history, techniques } = req.body;

      if (!name || !history || !techniques) {
        return res.status(400).json({ error: "Missing one or more properties." });
      }

      artsCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("Art created successfully.");
          res.json({ message: "Art created successfully.", id: result.insertedId });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while creating the art." });
        });
    });

    app.get("/arts/:id", (req, res) => {
      artsCollection
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((results) => {
          res.render("art.ejs", { art: results });
        })
        .catch((error) => console.error(error));
    });

    app.put("/arts/:id", (req, res) => {
      const { name, history, techniques } = req.body;

      if (!name || !history || !techniques) {
        return res.status(400).json({ error: "Missing one or more properties." });
      }

      artsCollection
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              name: name,
              history: history,
              techniques: techniques,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          if (result.lastErrorObject.updatedExisting) {
            res.json({ message: "Art updated successfully." });
          } else {
            res.json({ message: "Art created successfully.", id: result.lastErrorObject.upserted });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while updating the art." });
        });
    });

    app.delete("/arts/:id", (req, res) => {
      artsCollection
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((results) => {
          if (results.deletedCount === 0) {
            return res.json("No art to delete");
          }
          res.json("Art removed successfully.");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while removing the art." });
        });
    });

    // CUSTOMS

    app.get("/customs", (req, res) => {
      customsCollection
        .find()
        .toArray()
        .then((results) => {
          res.render("customs.ejs", { customs: results });
        })
        .catch((error) => console.error(error));
    });

    app.post("/customs", (req, res) => {
      const { name, description, observation } = req.body;

      if (!name || !description || !observation) {
        return res.status(400).json({ error: "Missing one or more properties." });
      }

      customsCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("Custom created successfully.");
          res.json({ message: "Custom created successfully.", id: result.insertedId });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while creating the custom." });
        });
    });

    app.get("/customs/:id", (req, res) => {
      customsCollection
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((results) => {
          res.render("custom.ejs", { custom: results });
        })
        .catch((error) => console.error(error));
    });

    app.put("/customs/:id", (req, res) => {
      const { name, description, observation } = req.body;

      if (!name || !description || !observation) {
        return res.status(400).json({ error: "Missing one or more properties." });
      }

      customsCollection
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              name: name,
              description: description,
              observation: observation,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          if (result.lastErrorObject.updatedExisting) {
            res.json({ message: "Custom updated successfully." });
          } else {
            res.json({ message: "Custom created successfully.", id: result.lastErrorObject.upserted });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while updating the custom." });
        });
    });

    app.delete("/customs/:id", (req, res) => {
      customsCollection
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((results) => {
          if (results.deletedCount === 0) {
            return res.json("No custom to delete");
          }
          res.json("Custom removed successfully.");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "An error occurred while removing the custom." });
        });
    });

    app.listen(process.env.PORT || PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => console.error(error));
