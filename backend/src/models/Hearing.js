import mongoose from "mongoose";

const hearingSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    court: String,
    status: {
      type: String,
      default: "upcoming",
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Hearing ||
  mongoose.model("Hearing", hearingSchema);
