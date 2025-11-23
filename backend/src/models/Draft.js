import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    content: {
      type: String,
      required: true,     // <-- required field
    },
    draftType: {
      type: String,
      default: "ai_generated",
    },
    lawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
  },
  { timestamps: true }
);

export default mongoose.models.Draft ||
  mongoose.model("Draft", DraftSchema);