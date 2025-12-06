import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";


import { connectDB } from "./config/db.js";
import caseRoutes from "./routes/caseRoutes.js";
import draftRoutes from "./routes/draftRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import hearingRoutes from "./routes/hearingRoutes.js";
connectDB();


const app = express();

const allowed = [
  process.env.FRONTEND_URL,
  "http://localhost:3000"
];

app.use(cors({
  origin: allowed,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/drafts", draftRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/hearings", hearingRoutes);

app.get("/", (req, res) => res.send("Lawyer Case API Running"));

const PORT = process.env.PORT || 5001;
console.log("JWT SECRET:", process.env.JWT_SECRET);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
