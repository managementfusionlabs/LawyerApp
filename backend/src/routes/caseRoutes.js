import express from "express";
import {
  createCase,
  getCase,
  updateCase,
  listCases,deleteCase
} from "../controllers/caseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCaseStats } from "../controllers/caseController.js";
import { markCaseSolved } from "../controllers/caseController.js";

const router = express.Router();

// Create case
router.post("/", authMiddleware, createCase);

// Get all cases
router.get("/", authMiddleware, listCases);

router.get("/stats", authMiddleware, getCaseStats);

// Get single case
router.get("/:id", authMiddleware, getCase);

// Update case
router.put("/:id", authMiddleware, updateCase);
router.put("/:id/solve", authMiddleware, markCaseSolved);
router.delete("/:id", authMiddleware, deleteCase);

export default router;
