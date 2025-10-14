import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Selected", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema); 
export default Application;