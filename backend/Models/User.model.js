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
    },

    // 🔹 PAYMENT ELIGIBILITY
    payment: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid", // employees are paid by default
      lowercase: true,
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

export default mongoose.model("User", userSchema);
