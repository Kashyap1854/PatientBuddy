import express from "express";
import fileRoutes from "./routes/fileRoutes";
import chatRouter from "./routes/chat"; // adjust path if needed
import "./db"; // Connect to MongoDB
import "dotenv/config";

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static("uploads"));

app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));