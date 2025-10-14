import express from "express";
import authRoute from "./authroute.js";
import userRoute from "./userroute.js";
import jobRoute from "./jobroute.js";
import applicationRoute from "./applicationroute.js";
import activityRoute from "./activityroute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/jobs", jobRoute);
router.use("/applications", applicationRoute);
router.use("/activity", activityRoute);

export default router;