import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import Note from "../models/Note.js";

export const getCommunityNotes = asyncHandler(async (_req, res) => {
  const notes = await Note.find({ isShared: true })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  successResponse(res, { data: { notes } });
});

export const likeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || !note.isShared) {
    throw new ApiError(404, "Note not found or not shared");
  }

  const userId = req.user._id;
  const index = note.likes.findIndex((id) => id.equals(userId));

  index === -1 ? note.likes.push(userId) : note.likes.splice(index, 1);
  await note.save();

  successResponse(res, {
    message: "Like status updated",
    data: {
      likesCount: note.likes.length,
      isLiked: index === -1,
    },
  });
});

export const commentOnNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, "Comment text required");

  const note = await Note.findById(req.params.id);
  if (!note || !note.isShared)
    throw new ApiError(404, "Note not found or not shared");

  note.comments.push({ user: req.user._id, text });
  await note.save();

  successResponse(res, {
    message: "Comment added",
    data: { comments: note.comments },
  });
});
