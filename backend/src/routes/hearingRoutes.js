import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addHearing,
  getHearingsByCase,
  getUpcomingHearings,
} from "../controllers/hearingController.js";

const router = express.Router();

router.post("/", authMiddleware, addHearing);
router.get("/case/:caseId", authMiddleware, getHearingsByCase);
router.get("/upcoming", authMiddleware, getUpcomingHearings);

export default router;
