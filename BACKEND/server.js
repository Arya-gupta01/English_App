import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import translateRoute from "./routes/translateRoute.js";

dotenv.config();
const app = express();

app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/translate", translateRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


