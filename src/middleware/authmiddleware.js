import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // support both id and _id (safe)
    const userId = decoded?.id || decoded?._id;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // attach full mongoose user document
    next();
  } catch (error) {
    return res.status(401).json({ error: "User not authenticated" });
  }
};

export default authentication;