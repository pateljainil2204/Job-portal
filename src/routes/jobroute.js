import express from "express";
import { 
    createJob, 
    getAllJobs, 
    getJobById, 
    updateJob, 
    deleteJob } from "../controller/jobcontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", authentication, roleMiddleware("Admin"), createJob);
router.put("/:id", authentication, roleMiddleware("Admin"), updateJob);
router.delete("/:id", authentication, roleMiddleware("Admin"), deleteJob);

export default router;