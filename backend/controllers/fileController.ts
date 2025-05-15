import { Request, Response } from "express";
import * as fs from "fs";
import FileModel from "../db/FileModel";
import { extractText } from "../services/extractServices";

// Upload and extract file
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = req.file.path;
    const extractedText = await extractText(filePath);

    const fileDoc = new FileModel({
      filename: req.file.originalname,
      content: extractedText,
    });
    await fileDoc.save();

    fs.unlinkSync(filePath);

    res.json({ message: "File uploaded and data saved!", data: fileDoc });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all files
export const getFiles = async (_req: Request, res: Response) => {
  try {
    const files = await FileModel.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};