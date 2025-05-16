import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://chanakya:ck123@patientbuddy.w5yss1z.mongodb.net/patientbuddy?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));