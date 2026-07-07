const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");
require("dotenv").config();

const Cat = require("./models/Cat");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.error(err);
    });

app.get("/api/cats", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cats", async (req, res) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});