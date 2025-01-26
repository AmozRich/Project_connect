import express from "express"
import Project from "../models/Project.js"
import User from "../models/User.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Get all projects
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find().populate("creator", "name")
    res.json(projects)
  } catch (error) {
    next(error)
  }
})

// Create a new project
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title, description, technologies, implementationDetails, resources } = req.body
    const project = new Project({
      title,
      description,
      technologies,
      implementationDetails,
      resources,
      creator: req.userId,
    })
    await project.save()
    await User.findByIdAndUpdate(req.userId, { $push: { projects: project._id } })
    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
})

// Get a specific project
router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("creator", "name")
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }
    res.json(project)
  } catch (error) {
    next(error)
  }
})

// Update a project
router.put('/:id', authMiddleware, async (req, res, next) => {
  tryI understand. I'll continue the text stream from the cut-off point, maintaining coherence and consistency with the previous content. Here's the continuation:

project
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { title, description, technologies, implementationDetails, resources } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    project.title = title;
    project.description = description;
    project.technologies = technologies;
    project.implementationDetails = implementationDetails;
    project.resources = resources;
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Delete a project
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    await project.remove();
    await User.findByIdAndUpdate(req.userId, { $pull: { projects: project._id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Add a comment to a project
router.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const { content } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const comment = {
      user: req.userId,
      content,
      createdAt: new Date()
    };
    project.comments.push(comment);
    await project.save();
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

// Get comments for a project
router.get('/:id/comments', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('comments.user', 'name');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project.comments);
  } catch (error) {
    next(error);
  }
});

// Add a rating to a project
router.post('/:id/rating', authMiddleware, async (req, res, next) => {
  try {
    const { score } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const existingRating = project.ratings.find(rating => rating.user.toString() === req.userId);
    if (existingRating) {
      existingRating.score = score;
    } else {
      project.ratings.push({ user: req.userId, score });
    }
    await project.save();
    const averageRating = project.ratings.reduce((sum, rating) => sum + rating.score, 0) / project.ratings.length;
    res.json({ averageRating });
  } catch (error) {
    next(error);
  }
});

export default router;

