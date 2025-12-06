import express from "express";
import {
  createDraft,
  saveDraft,
  getDrafts,
  getDraftById,
  getLatestDraft,
  deleteDraft,updateDraft
} from "../controllers/draftController.js";
import { createPdf } from "../controllers/pdfController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save manual drafts
router.post("/save", authMiddleware, saveDraft);

// List drafts
router.get("/", authMiddleware, getDrafts);

// Generate AI draft
router.post("/case/:caseId/generate", authMiddleware, createDraft);

router.get("/case/:caseId/pdf", authMiddleware, createPdf);

// Get latest draft for a case
router.get("/case/:caseId", authMiddleware, getLatestDraft);

//edit draft
router.put("/:id", authMiddleware, updateDraft);

// Export PDF
router.get("/:id/pdf", authMiddleware, createPdf);

// Get a specific draft
router.get("/:id", authMiddleware, getDraftById);

// Delete a draft
router.delete("/:id", authMiddleware, deleteDraft);

export default router;
