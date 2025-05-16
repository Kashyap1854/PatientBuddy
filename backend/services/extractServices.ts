// If you are running in Node.js, ensure you have @types/node installed:
// Run: npm install --save-dev @types/node

import { promises as fs } from "fs";

export const extractText = async (filePath: string): Promise<string> => {
  // For plain text files
  return await fs.readFile(filePath, "utf-8");
};