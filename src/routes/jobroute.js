import express from "express";
import { 
    createJob, 
    getAllJobs, 
    getJob, 
    updateJob, 
    deleteJob } from "../controller/jobcontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/search", getJob);
router.post("/", authentication, roleMiddleware("Admin"), createJob);
router.put("/:id", authentication, roleMiddleware("Admin"), updateJob);
router.delete("/:id", authentication, roleMiddleware("Admin"), deleteJob);

export default router;