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
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Hearing ||
  mongoose.model("Hearing", hearingSchema);
