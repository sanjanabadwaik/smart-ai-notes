import { Router } from "express";
import {
  deleteNotes,
  generateNotes,
  getMyNotes,
  saveNote, 
} from "../controllers/notes.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";  

const router = Router();

// 🔐 Protect all routes
router.use(protect);

// 📝 Generate notes (text | youtube | document | audio | video)
router.post("/generate", upload.single("file"), generateNotes);

// 💾 Save note
router.post("/", saveNote);

// 📄 Get my notes
router.get("/", getMyNotes);

// 🗑 Delete note
router.delete("/:id", deleteNotes);
 

export default router;
