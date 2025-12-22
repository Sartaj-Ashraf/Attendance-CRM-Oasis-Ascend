import express from "express";
const router = express.Router();
import {
  createUser,
  disableaccount,
  editUser,
  activateaccount,
  assignRole,
} from "../Controllers/owner.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { markAttendance } from "../Controllers/attendence.controller.js";
router.post("/create", authMiddleware, isAdmin, createUser);
router.post("/edituser/:id", authMiddleware, isAdmin, editUser);
router.post("/disableaccount/:id", authMiddleware, isAdmin, disableaccount);
router.post("/activateaccount/:id", authMiddleware, isAdmin, activateaccount);
router.post("/asignrole/:id", authMiddleware, isAdmin, assignRole);
router.post("/markattendence",authMiddleware,isAdmin,markAttendance)
export default router;
