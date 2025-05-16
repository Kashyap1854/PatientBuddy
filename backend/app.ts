import express from "express";
import fileRoutes from "./routes/fileRoutes";

const app = express();

app.use(express.json());
app.use("/api/files", fileRoutes); // <-- This is important!

export default app;
