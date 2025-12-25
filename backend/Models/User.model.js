import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },

    role: {
      type: String,
      enum: ["owner", "employee", "manager"],
      default: "employee",
      index: true,
    },

    payment: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
      lowercase: true,
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    // ✅ Reporting Manager
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    passwordSetupToken: String,
    passwordSetupExpires: Date,
  },
  { timestamps: true }
);

// Helpful index
userSchema.index({ department: 1, reportingManager: 1 });

export default mongoose.model("User", userSchema);
