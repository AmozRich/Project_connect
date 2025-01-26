import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decodedToken.userId
    next()
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" })
  }
}

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

