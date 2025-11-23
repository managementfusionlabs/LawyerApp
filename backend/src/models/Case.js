import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    clientName: String,
    phone: String,
    email: String,
    address: String,

    caseType: String,
    caseNumber: String,
    courtName: String,
    filingDate: String,

    opponentName: String,
    opponentAddress: String,

    description: String,

    evidence: [String], // file paths
    status: {
      type: String,
      default: "active",
    },

    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  
  { timestamps: true }
);

export default mongoose.models.Case || mongoose.model("Case", caseSchema);
