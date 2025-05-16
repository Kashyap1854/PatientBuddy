import * as express from "express";
import fileRoutes from "./routes/fileRoutes";
import "./db"; // Connect to MongoDB

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));