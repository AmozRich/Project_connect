import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    implementationDetails: String,
    resources: [{ title: String, url: String }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: Number,
      },
    ],
  },
  { timestamps: true },
)

const Project = mongoose.model("Project", projectSchema)

export default Project

