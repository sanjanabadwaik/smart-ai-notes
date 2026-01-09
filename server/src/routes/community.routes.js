import { Router } from "express";
import {
  getCommunityNotes,
  likeNote,
  commentOnNote,
} from "../controllers/community.controller.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.get("/notes", getCommunityNotes);
router.post("/notes/:id/like", protect, likeNote);
router.post("/notes/:id/comment", protect, commentOnNote);

export default router;
