import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  verifyPassword,
  setPendingEmail,
} from "../Controllers/auth.controllers.js";
const router = express.Router();

// ✅ verify password route
router.get("/verify-password", authMiddleware, verifyPassword);
router.put("/setPendingEmail", authMiddleware, setPendingEmail);
// router.get
export default router;
