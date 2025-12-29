import express from "express";
// import { authMiddleware } from "../mixddleware/auth.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  applyLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leave.controllers.js";

const router = express.Router();

/* EMPLOYEE */
router.post("/apply", authMiddleware, applyLeave);

/* MANAGER / OWNER */
router.get("/all", authMiddleware, getAllLeaves);
router.patch("/:leaveId/approve", authMiddleware, approveLeave);
router.patch("/:leaveId/reject", authMiddleware, rejectLeave);

export default router;
