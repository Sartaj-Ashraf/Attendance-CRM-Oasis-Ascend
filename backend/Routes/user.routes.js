import express from "express";
import {
  setPassword,
  verifyToken,
  loginUser,
  getCurrentAttendance,
  resetpassword,
  logout,
} from "../Controllers/User.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/login", loginUser);
router.get("/verifyToken", verifyToken);
router.patch("/setpassword", setPassword);
router.get("/getCurrentUserdata", authMiddleware, getCurrentAttendance);
router.post("/resetpassword", resetpassword);
router.post("/logout", authMiddleware, logout);
export default router;
