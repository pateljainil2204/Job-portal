import mongoose from "mongoose";
import Application from "../model/applicationModel.js";

// Get all applications (Admin only)
const getAllApplications = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }

    const applications = await Application.find()
      .populate("user", "name email role")
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a specific user (Member or Admin)
const getUserApplications = async (req, res) => {
  try {
    const userId = req.params.id; // route uses /user/:id

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Allow access if Admin OR requesting their own applications
    if (req.user.role !== "Admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job
// Expects { jobId, userId } in body. Members may only apply for themselves; Admins may apply for others.
const applyJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({ message: "Job ID and User ID are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Allow Members to apply only for themselves
    if (req.user.role === "Member" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Members can only apply for themselves" });
    }

    // Check if user already applied
    const existing = await Application.findOne({
      job: jobId,
      user: new mongoose.Types.ObjectId(userId),
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // Create new application
    const application = await Application.create({
      job: jobId,
      user: new mongoose.Types.ObjectId(userId),
    });

    // Populate for response
    const populatedApplication = await Application.findById(application._id)
      .populate("user", "name email role")
      .populate("job", "title company location salary");

    res.status(201).json({
      message: "Applied successfully",
      application: populatedApplication,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a previously applied job (Member can delete own; Admin can delete any)
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the application first
    const application = await Application.findById(id)
      .populate("user", "name email role")
      .populate("job", "title company location salary");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check access permissions
    if (
      req.user.role === "Member" &&
      application.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete and return deleted application details
    await Application.findByIdAndDelete(id);

    res.status(200).json({
      message: "Application deleted successfully",
      deletedApplication: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllApplications, getUserApplications, applyJob, deleteApplication };