import express from "express";
import getAllActivity from "../controller/activitycontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", authentication, roleMiddleware("Admin"), getAllActivity);

export default router;