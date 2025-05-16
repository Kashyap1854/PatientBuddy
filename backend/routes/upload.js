const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const router = express.Router();
const path = require("path");

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  const { category } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const newFile = new File({
    filename: file.originalname,
    path: file.filename,
    category,
  });

  await newFile.save();
  res
    .status(200)
    .json({ message: "File uploaded successfully", file: newFile });
});

// Fetch all uploaded files
router.get("/files", async (req, res) => {
  const files = await File.find().sort({ uploadedAt: -1 });
  res.json(files);
});

module.exports = router;
