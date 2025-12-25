import express from "express";
const router = express.Router();
import {
  createUser,
  disableaccount,
  editUser,
  activateaccount,
  assignRole,
  deleteUser,
  getAllDepartmentUser,
  getBlockedUser,
  GetAllEmployee,
  GetManagers,
  BlockedUsers,
} from "../Controllers/owner.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import {
  markAttendance,
  markBulkAttendance,
} from "../Controllers/attendence.controller.js";
router.post("/create", authMiddleware, isAdmin, createUser);
router.post("/edituser/:id", authMiddleware, isAdmin, editUser);
router.patch("/disableaccount/:id", authMiddleware, isAdmin, disableaccount);
router.post("/activateaccount/:id", authMiddleware, isAdmin, activateaccount);
router.post("/asignrole/:id", authMiddleware, isAdmin, assignRole);
router.post("/markattendence", authMiddleware, isAdmin, markAttendance);
router.post("/attendance/bulk", authMiddleware, markBulkAttendance);
router.post("/deleteUser/:id", authMiddleware, isAdmin, deleteUser);
router.get("/getAllUsers", authMiddleware, isAdmin, getAllDepartmentUser);
router.get("/getAllEmployee", authMiddleware, isAdmin, GetAllEmployee);
router.post("/getBlockedUser", authMiddleware, isAdmin, getBlockedUser);
router.get("/getManagers", authMiddleware, isAdmin, GetManagers);
router.get("/getBlockedUsers", authMiddleware, isAdmin, BlockedUsers);
export default router;
