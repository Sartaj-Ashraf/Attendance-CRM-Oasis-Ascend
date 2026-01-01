import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { verifyPassword } from "../Controllers/auth.controllers.js";
const router = express.Router();

// ✅ verify password route
router.get("/verify-password", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Password verified successfully",
    user: req.user, // comes from authMiddleware
  });
});
// router.get
export default router;
