import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../Models/User.model.js";
import { sendEmail } from "../services/email.service.js";
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
export const setPendingEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Generate secure 5-digit OTP
    const otp = crypto.randomInt(10000, 100000);

    // ✅ Hash OTP before saving
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    // ✅ Send OTP email
    await sendEmail({
      toEmail: email,
      type: "VERIFY_OTP",
      data: { otp },
    });

    // ✅ Save pending email + OTP
    user.pendingEmail = email.toLowerCase();
    user.verifyOtp = hashedOtp;
    user.verifyOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent to new email for verification",
    });
  } catch (error) {
    console.error("setPendingEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

