const mongoose = require("mongoose");

const MedicalDocumentSchema = new mongoose.Schema({
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cat",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      "Vaccination Record",
      "Rabies Certificate",
      "Spay/Neuter Certificate",
      "General Vet Visit"
    ],
    required: true
  },

  visitDate: Date,

  fileName: String,

  pdf: Buffer,

  mimeType: String

}, {
  timestamps: true
});

module.exports = mongoose.model("MedicalDocument", MedicalDocumentSchema);