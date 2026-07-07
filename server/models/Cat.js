const mongoose = require("mongoose");

const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: String,
  age: Number,
  weight: Number,
  avatar: String,
  status: String,
  nextCare: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Cat", CatSchema);