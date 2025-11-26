import mongoose from "mongoose";
import Hearing from "../models/Hearing.js";

// ------------------ ADD HEARING ------------------
export const addHearing = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { caseId, date, notes, court } = req.body;

    const hearing = await Hearing.create({
      caseId,
      lawyerId,
      date,
      notes,
      court,
      status: "upcoming",
    });

    return res.status(201).json({ hearing });
  } catch (err) {
    console.error("HEARING ADD ERROR:", err);
    res.status(500).json({ error: "Failed to add hearing" });
  }
};

// ------------------ GET HEARINGS BY CASE ------------------
export const getHearingsByCase = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { caseId } = req.params;

    const hearings = await Hearing.find({
      caseId,
      lawyerId,
    }).sort({ date: 1 });

    return res.json({ hearings });
  } catch (err) {
    console.error("HEARING LIST ERROR:", err);
    res.status(500).json({ error: "Failed to fetch hearings" });
  }
};

// ------------------ UPCOMING HEARINGS ------------------
export const getUpcomingHearings = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    // include hearings scheduled for today and later — use start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const hearings = await Hearing.find({
      lawyerId,
      status: "upcoming",
      date: { $gte: startOfToday },
    }).sort({ date: 1 });

    return res.json({ hearings });
  } catch (err) {
    console.error("UPCOMING HEARINGS ERROR:", err);
    res.status(500).json({ error: "Failed to load upcoming hearings" });
  }
};

// ------------------ UPDATE HEARING ------------------
export const updateHearing = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { id } = req.params;
    const { date, notes, court, status } = req.body;

    const hearing = await Hearing.findOneAndUpdate(
      { _id: id, lawyerId },
      { date, notes, court, status },
      { new: true }
    );

    if (!hearing) {
      return res.status(404).json({ error: "Hearing not found" });
    }

    return res.json({ hearing });
  } catch (err) {
    console.error("HEARING UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update hearing" });
  }
};
