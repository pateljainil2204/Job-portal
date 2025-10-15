import Job from "../model/jobModel.js";
import logactivity from "../middleware/activitylogger.js";

// Create a new job (Admin only)
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }

    const { title, description, company, location, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      createdBy: req.user._id,
    });

    await logactivity(req.user._id, `Created job: ${title}`);

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs or list (anyone can access)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job by title
const getJob = async (req, res) => {
  try {
    const { title } = req.body; // ✅ now reading from body, not query

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Enter title" });
    }

    // Case-insensitive search
    const jobs = await Job.find({
      title: { $regex: title, $options: "i" },
    }).sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No vacancy for the given title" });
    }

    res.status(200).json({ count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a job (Admin only)
const updateJob = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    await logactivity(req.user._id, `Updated job: ${job.title}`);

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job (Admin only)
const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }

    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await logactivity(req.user._id, `Deleted job: ${job.title}`);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createJob, getAllJobs, getJob, updateJob, deleteJob };