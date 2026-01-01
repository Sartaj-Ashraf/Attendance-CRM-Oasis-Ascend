import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  verifyPassword,
  setPendingEmail,
  resendEmailOtp,
  verifyEmail,
  resendSetPasswordEmail,
} from "../Controllers/auth.controllers.js";
const router = express.Router();

// ✅ verify password route
router.post("/verify-password", authMiddleware, verifyPassword);
router.put("/setPendingEmail", authMiddleware, setPendingEmail);
router.post("/resendOtp", authMiddleware, resendEmailOtp);
router.post("/verifyEmail", authMiddleware, verifyEmail);
router.post("/resend-confirmation/:id", authMiddleware, resendSetPasswordEmail);
// router.get
export default router;
