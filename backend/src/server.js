import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import caseRoutes from "./routes/caseRoutes.js";
import draftRoutes from "./routes/draftRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import hearingRoutes from "./routes/hearingRoutes.js";

connectDB();

const app = express();

// ⭐ Allow ALL dev LAN devices (phones, laptops, tablets)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);

    // Allow ANY device on LAN or localhost
    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1") ||
      origin.startsWith("http://192.") ||
      origin.startsWith("http://10.") ||
      origin.startsWith("http://172.")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/drafts", draftRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/hearings", hearingRoutes);

app.get("/", (req, res) => res.send("Lawyer Case API Running"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
