const express = require("express");
const cors = require("cors");
const multer = require("multer");

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

const upload = multer({
  storage: multer.memoryStorage()
});

const MedicalDocument = require("./models/MedicalDocument");

// Get info about cat from database
app.get("/api/cats", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send databased info about new cat
app.post("/api/cats", async (req, res) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send database new uploaded medical document
app.post("/api/documents", upload.single("pdf"), async (req, res) => {
  try {
    const document = await MedicalDocument.create({
      catId: req.body.catId,
      title: req.body.title,
      type: req.body.type,
      visitDate: req.body.visitDate,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      pdf: req.file.buffer
    });
    res.status(201).json(document);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get medical document info
app.get("/api/documents/:catId", async (req, res) => {
    const documents = await MedicalDocument.find({
        catId: req.params.catId
    });

    res.json(documents);
});

// Get PDF viewing info
app.get("/api/documents/view/:id", async (req, res) => {
  const document = await MedicalDocument.findById(req.params.id);

  res.contentType(document.mimeType);

  res.send(document.pdf);
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});