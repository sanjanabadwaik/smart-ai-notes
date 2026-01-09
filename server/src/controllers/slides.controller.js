import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { convertSlidesToNotes } from "../services/slideParser.service.js";
import ApiError from "../utils/ApiError.js";
import Note from "../models/Note.js";

export const convertSlides = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Upload a PDF or PPTX file");

  const { summaryType = "bullet", language = "English", title = "Slides Conversion" } = req.body;

  const structuredNotes = await convertSlidesToNotes({
    filePath: req.file.path,
    summaryType,
    language,
  });

  const renderedContent = [
    structuredNotes.overview || "",
    ...(structuredNotes.sections || []).map(
      (section) => `## ${section.title}\n${section.bullets?.map((b) => `- ${b}`).join("\n")}`
    ),
    structuredNotes.takeaways ? `### Takeaways\n${structuredNotes.takeaways.join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const note = await Note.create({
    title,
    content: renderedContent,
    keyPoints: structuredNotes.takeaways || [],
    highlights: structuredNotes.sections?.flatMap((s) => s.bullets.slice(0, 1)) || [],
    sourceType: "slides",
    summaryType,
    language,
    user: req.user._id,
    isShared: req.body.isShared ?? false,
  });

  successResponse(res, {
    message: "Slides converted successfully",
    data: { structuredNotes, note },
  });
});
