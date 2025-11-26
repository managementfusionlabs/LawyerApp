import mongoose from "mongoose";
import Case from "../models/Case.js";
import Hearing from "../models/Hearing.js";

// ------------------ CASE STATS ------------------
export const getCaseStats = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const activeCases = await Case.countDocuments({
      lawyerId,
      status: "active",
    });

    const solvedCases = await Case.countDocuments({
      lawyerId,
      status: "solved",
    });

    // count hearings from start of today onwards so "today" is considered upcoming
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const upcomingHearings = await Hearing.countDocuments({
      lawyerId,
      date: { $gte: startOfToday },
    });

    return res.json({
      activeCases,
      solvedCases,
      upcomingHearings,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    return res.status(500).json({ error: "Failed to load stats" });
  }
};

// ------------------ CREATE CASE ------------------
export const createCase = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const caseData = await Case.create({
      lawyerId,
      ...req.body,
      status: "active",
    });

    return res.status(201).json(caseData);
  } catch (err) {
    console.error("Create Case Error:", err);
    return res.status(500).json({ error: "Failed to create case" });
  }
};

// ------------------ GET CASE + HEARINGS ------------------
export const getCase = async (req, res) => {
  try {
    const caseId = req.params.id;

    const caseData = await Case.findById(caseId).lean();
    if (!caseData) return res.status(404).json({ error: "Case not found" });

    console.log("CASE HIT ✔");

    const hearings = await Hearing.find({
      caseId: new mongoose.Types.ObjectId(caseId),
      lawyerId: new mongoose.Types.ObjectId(req.user.id),
    })
      .sort({ date: 1 })
      .lean();

    console.log("HEARINGS:", hearings);

    caseData.hearings = hearings;

    return res.json({ case: caseData });
  } catch (err) {
    console.error("Get Case Error:", err);
    return res.status(500).json({ error: "Failed to fetch case" });
  }
};

// ------------------ UPDATE CASE ------------------
export const updateCase = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { id } = req.params;

    const updated = await Case.findOneAndUpdate(
      { _id: id, lawyerId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Case not found" });
    }

    return res.json({ case: updated });
  } catch (err) {
    console.error("UPDATE CASE ERROR:", err);
    return res.status(500).json({ error: "Failed to update case" });
  }
};

// ------------------ LIST CASES ------------------
export const listCases = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const data = await Case.find({ lawyerId }).sort({ createdAt: -1 });

    return res.json(data);
  } catch (err) {
    console.error("List Cases Error:", err);
    return res.status(500).json({ error: "Failed to list cases" });
  }
};

// ------------------ MARK CASE AS SOLVED ------------------
export const markCaseSolved = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { id } = req.params;

    const updated = await Case.findOneAndUpdate(
      { _id: id, lawyerId },
      { status: "solved" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Case not found" });
    }

    return res.json({ message: "Case marked as solved", case: updated });
  } catch (err) {
    console.error("MARK SOLVED ERROR:", err);
    return res.status(500).json({ error: "Failed to mark case solved" });
  }
};

// ------------------ DELETE CASE ------------------
export const deleteCase = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { id } = req.params;

    const deleted = await Case.findOneAndDelete({ _id: id, lawyerId });

    if (!deleted) {
      return res.status(404).json({ error: "Case not found" });
    }

    // also remove hearings attached to the case
    await Hearing.deleteMany({ caseId: id, lawyerId });

    return res.json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("DELETE CASE ERROR:", err);
    return res.status(500).json({ error: "Failed to delete case" });
  }
};
