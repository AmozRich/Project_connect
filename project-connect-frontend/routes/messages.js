import express from "express"
import Message from "../models/Message.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Get conversations for the current user
router.get("/conversations", authMiddleware, async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.userId }, { receiver: req.userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", req.userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          "user.name": 1,
          "lastMessage.content": 1,
          "lastMessage.createdAt": 1,
        },
      },
    ])
    res.json(conversations)
  } catch (error) {
    next(error)
  }
})

// Get messages for a specific conversation
router.get("/:userId", authMiddleware, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId },
      ],
    }).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    next(error)
  }
})

// Send a message
router.post("/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { content } = req.body
    const message = new Message({
      sender: req.userId,
      receiver: req.params.userId,
      content,
    })
    await message.save()
    res.status(201).json(message)
  } catch (error) {
    next(error)
  }
})

export default router

