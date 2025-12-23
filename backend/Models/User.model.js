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

    role: {
      type: String,
      enum: ["admin", "employee"],
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
      default: false,
    },
isDeleted:{
  type:Boolean,
  default:false
},
    passwordSetupToken: String,
    passwordSetupExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
