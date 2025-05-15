import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  filename: string;
  content: string;
  uploadedAt: Date;
}

const FileSchema = new Schema<IFile>({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFile>("File", FileSchema);