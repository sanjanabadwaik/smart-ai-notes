import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import ApiError from "../utils/ApiError.js";
import Note from "../models/Note.js";
import { generateQA } from "../services/qaGenerator.service.js";

export const generateQuestions = asyncHandler(async (req, res) => {
  const { noteId, notes: rawNotes, questionType = "MCQ", difficulty = "Medium" } = req.body;

  let notesContent = "";

  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) throw new ApiError(404, "Note not found");
    notesContent = note.content;
  } else if (rawNotes?.trim()) {
    notesContent = rawNotes.trim();
  } else {
    throw new ApiError(400, "Notes content is required");
  }

  const qaItems = await generateQA({
    notes: notesContent,
    questionType,
    difficulty,
  });

  successResponse(res, {
    message: "Questions generated",
    data: { qa: qaItems },
  });
});
