import express from "express";
import { createPdf } from "../controllers/pdfController.js";

const router = express.Router();

router.post("/:caseId/create", createPdf);

export default router;
