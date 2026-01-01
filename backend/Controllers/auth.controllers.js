import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../Models/User.model.js";
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    /* ================= VALIDATION ================= */
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    /* ================= USER ================= */
    const user = await userModel.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "User account deleted",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account disabled",
      });
    }

    /* ================= PASSWORD CHECK ================= */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    /* ================= SUCCESS ================= */
    return res.status(200).json({
      success: true,
      message: "Password verified successfully",
    });
  } catch (error) {
    console.error("Verify password error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
