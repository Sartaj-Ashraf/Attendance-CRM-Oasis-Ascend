import dotenv from "dotenv";
dotenv.config();
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log(
//   "EMAIL_PASS length:",
//   process.env.EMAIL_PASS ? process.env.EMAIL_PASS: "MISSING"
// );
import { authMiddleware } from "./middleware/auth.middleware.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./Database/Database.js";
import morgan from "morgan";
import userRouter from "./Routes/user.routes.js";
import ownerRoute from "./Routes/owner.routes.js";
import commonRoute from "./Routes/common.routes.js";
import { seed } from "./seed/seedStatus.js";
connectDB();
const app = express();
app.use(
  cors({
    origin:
      process.env.MODE === "development"
        ? process.env.LOCAL_URL
        : process.env.FRONTEND_URL,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true, // enable cookies / auth headers
  })
);
// seed();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("backend is running perfectly");
});
const PORT = process.env.PORT || 5000;
app.use("/user", userRouter);
app.use("/owner", ownerRoute);
app.use("/api", commonRoute);
// auth middleware


app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
