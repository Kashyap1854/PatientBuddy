const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  category: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);
