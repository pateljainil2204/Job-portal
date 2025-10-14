import express from "express";
import { getAllUsers, getUserById, deleteUser } from "../controller/usercontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", authentication, roleMiddleware("Admin"), getAllUsers);
router.get("/:id", authentication, roleMiddleware("Admin"), getUserById);
router.delete("/:id", authentication, roleMiddleware("Admin"), deleteUser);

export default router;