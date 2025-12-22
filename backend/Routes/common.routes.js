import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
const app = express();
const router = express.Router();
// router.get("/statuses", getAllStatuses);
app.get("/isAuth", authMiddleware, (req, res) => {
  const { role, id } = req.user;
  return res.status(200).json({ data: { role, id } });
});
export default router;
