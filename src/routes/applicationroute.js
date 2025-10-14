import express from "express";
import { 
    getAllApplications, 
    getUserApplications, 
    applyJob, 
    deleteApplication } from "../controller/applicationcontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", authentication, roleMiddleware("Admin"), getAllApplications);
router.get("/user/:id", authentication, getUserApplications);
router.post("/apply", authentication, applyJob);
router.delete("/:id", authentication, deleteApplication);

export default router;