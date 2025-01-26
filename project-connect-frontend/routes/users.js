import express from "express"
import User from "../models/User.js"
import { authMiddleware, adminMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
})

// Update user profile
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to update this profile" })
    }
    const { name, department, graduationYear, skills } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, department, graduationYear, skills },
      { new: true },
    ).select("-password")
    res.json(user)
  } catch (error) {
    next(error)
  }
})

// Get all users (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    next(error)
  }
})

// Delete user (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router

