import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    keyPoints: [{ type: String }],
    highlights: [{ type: String }],
    sourceType: {
      type: String,
      enum: ["audio", "video", "text", "youtube", "slides", "document", "pdf"], 
      default: "text",
    },
    summaryType: {
      type: String,
      enum: ["short", "detailed", "bullet"],
      default: "short",
    },
    language: { type: String, default: "English" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isShared: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
