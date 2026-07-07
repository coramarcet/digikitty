const mongoose = require("mongoose");

const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthday: Date,
  breed: String,
  age: Number,
  weight: Number,
  avatar: String,
  nextCare: String,
  nextCareDate: Date,
  medications: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("Cat", CatSchema);