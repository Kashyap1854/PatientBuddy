import { Router, Request, Response } from "express";
// import * as multer from "multer";
// import multer from "multer";
const multer = require("multer");
import { uploadFile, getFiles } from "../controllers/fileController";
import FileModel from "../db/FileModel";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save with original filename
  },
});
const upload = multer({ storage });

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/upload", upload.single("file"), asyncHandler(uploadFile));
router.get("/", asyncHandler(getFiles));

router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  const file = await FileModel.findByIdAndDelete(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });
  res.json({ message: "File deleted" });
}));

export default router;