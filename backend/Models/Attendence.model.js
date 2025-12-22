import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },

    // Owner/Admin who last marked attendance
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 🔒 One attendance per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Normalize date to day-level
attendanceSchema.pre("save", function (next) {
  this.date.setHours(0, 0, 0, 0);
  next();
});

export default mongoose.model("Attendance", attendanceSchema);
