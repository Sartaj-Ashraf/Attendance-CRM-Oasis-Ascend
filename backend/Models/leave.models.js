import mongoose from "mongoose"
const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["sick", "casual", "annual", "maternity"],
      default: "casual",
      required: true,
    },

    days: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

leaveSchema.index({ user: 1, status: 1 });

export default mongoose.model("Leave", leaveSchema);
