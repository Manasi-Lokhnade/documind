import express from "express";

import {
  askQuestion,
  getUserChats,
  deleteChat,
} from "../controllers/chatController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router =
  express.Router();

// ✅ ASK QUESTION

router.post(
  "/ask",
  authMiddleware,
  askQuestion
);

// ✅ GET CHAT HISTORY

router.get(
  "/history",
  authMiddleware,
  getUserChats
);

// ✅ DELETE CHAT

router.delete(
  "/:id",
  authMiddleware,
  deleteChat
);

export default router;