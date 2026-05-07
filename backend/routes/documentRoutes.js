import express from "express";

import {
  uploadDocument,
  getUserDocuments,
} from "../controllers/documentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// 📄 Upload PDF
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

// 📚 Get User Documents
router.get(
  "/my-documents",
  authMiddleware,
  getUserDocuments
);

export default router;