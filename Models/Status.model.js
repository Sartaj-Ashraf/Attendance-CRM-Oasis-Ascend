import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["present", "absent", "leave", "late"],
      lowercase: true,
      index: true,
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

statusSchema.index({ status: 1 }, { unique: true });

export default mongoose.model("Status", statusSchema);
