import { promises as fs } from "fs";
import pdfParse from "pdf-parse";
import * as mammoth from "mammoth";
import * as path from "path";

export const extractText = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const data = await fs.readFile(filePath);
    const pdfData = await pdfParse(data);
    return pdfData.text || "[No text found in PDF]";
  }

  if (ext === ".docx") {
    const data = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: data });
    return result.value || "[No text found in DOCX]";
  }

  if (ext === ".txt") {
    return await fs.readFile(filePath, "utf-8");
  }

  return "[Unsupported file type]";
};