import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
const app = express();
const router = express.Router();
import UserModel from "../Models/User.model.js";

// router.get("/statuses", getAllStatuses);
router.get("/isAuth", authMiddleware, async (req, res) => {
  const user = await UserModel.findById(req.user.id).select(
    "username email role"
  );

  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }

  return res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
export default router;
