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
router.patch(" /approve/:leaveId", authMiddleware, approveLeave);

router.patch("/reject/:leaveId", authMiddleware, rejectLeave);

export default router;
