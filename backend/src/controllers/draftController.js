import Case from "../models/Case.js";
import Draft from "../models/Draft.js";
import { generateDraftFromCase } from "../utils/ai.js";



 
//clean the text by removing markdown syntax and extra spaces
// function cleanText(text) {
//   if (!text) return "";

//   return text
//     .replace(/^#+\s*/gm, "")           // remove markdown headings (#, ##, ###)
//     .replace(/^[\*\-]\s*/gm, "")       // remove bullets "-" or "*"
//     .replace(/[*_`]/g, "")             // remove *, _, `
//     .replace(/[-=]{3,}/g, "")          // remove '---', '===='
//     .replace(/\s{2,}/g, " ")           // normalize spaces
//     .trim();
// }

export const createDraft = async (req, res) => {
  try {
    const { caseId } = req.params;
    const lawyerId = req.user.id;

    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ error: "Case not found" });

    // Generate AI text
    const draftText = await generateDraftFromCase(caseData);
  //clean
    // const cleanedText = cleanText(draftText);

    // Save draft under 'content' for consistency
    const draft = await Draft.create({
      caseId,
      content: draftText,
      lawyer: lawyerId,
      draftType: "ai_generated",
    });

    return res.json({
      message: "Draft generated",
      draft,
    });
  } catch (err) {
    console.error("Draft Generation Error:", err);
    return res.status(500).json({ error: "Failed to generate draft" });
  }
};


/**
 * Save Manual Draft
 */
export const saveDraft = async (req, res) => {
  try {
    const { caseId, draftType, content } = req.body;
    const lawyerId = req.user.id;

    if (!caseId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const draft = await Draft.create({
      caseId,
      draftType,
      content,
      lawyer: lawyerId,
    });

    return res.status(201).json({ draft });
  } catch (err) {
    console.error("SAVE DRAFT ERROR:", err);
    return res.status(500).json({ error: "Could not save draft" });
  }
};


/**
 * Get Draft by ID (Only if owned by lawyer)
 */
export const getDraftById = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { id } = req.params;

    const draft = await Draft.findOne({ _id: id, lawyer: lawyerId });

    if (!draft) return res.status(404).json({ error: "Draft not found" });

    return res.json({ draft });
  } catch (err) {
    console.error("GET DRAFT ERROR:", err);
    return res.status(500).json({ error: "Could not fetch draft" });
  }
};


/**
 * Fetch Latest Draft for a Case
 */
export const getLatestDraft = async (req, res) => {
  try {
    const { caseId } = req.params;

    const draft = await Draft.findOne({ caseId }).sort({ createdAt: -1 });

    if (!draft) {
      return res.status(404).json({ error: "No draft found" });
    }

    return res.json(draft);
  } catch (err) {
    console.error("Get Draft Error:", err);
    return res.status(500).json({ error: "Failed to fetch draft" });
  }
};


/**
 * Fetch All Drafts for Logged-in Lawyer
 */
export const getDrafts = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const drafts = await Draft.find({ lawyer: lawyerId })
      .populate("caseId", "caseNumber clientName")
      .sort({ createdAt: -1 });

    return res.json({ drafts });
  } catch (err) {
    console.error("GET DRAFTS ERROR:", err);
    return res.status(500).json({ error: "Could not fetch drafts" });
  }
};


/**
 * Delete Draft
 */
export const deleteDraft = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { id } = req.params;

    const deleted = await Draft.findOneAndDelete({
      _id: id,
      lawyer: lawyerId,
    });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete" });
  }
};
