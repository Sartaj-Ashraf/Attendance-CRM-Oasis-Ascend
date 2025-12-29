import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "leave", "holiday"],
      required: true,
    },

    // ✅ BACKEND-ONLY FIELD
    leaveType: {
      type: String,
      enum: ["paid", "unpaid"],
      default: undefined,
    },

    note: String,

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
