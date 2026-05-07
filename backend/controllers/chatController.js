import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

import Chat from "../models/Chat.js";
import Document from "../models/Document.js";

import {
  getVectorStore,
} from "../services/vectorService.js";

// ✅ OpenAI Setup

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ ASK QUESTION

export const askQuestion =
async (req, res) => {

  try {

    const {
      question,
      documentId,
    } = req.body;

    // Validation

    if (
      !question ||
      !documentId
    ) {

      return res.status(400).json({
        message:
          "Question and documentId are required",
      });
    }

    // Find Document

    const document =
      await Document.findById(
        documentId
      );

    if (!document) {

      return res.status(404).json({
        message:
          "Document not found",
      });
    }

    // Vector Store

    const vectorStore =
      getVectorStore(
        documentId
      );

    if (!vectorStore) {

      return res.status(400).json({
        message:
          "Embeddings not found. Re-upload PDF.",
      });
    }

    // Similarity Search

    const relevantDocs =
      await vectorStore.similaritySearch(
        question,
        4
      );

    // Context

    const context =
      relevantDocs
        .map(
          (doc) =>
            doc.pageContent
        )
        .join("\n");

    // OpenAI Response

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
You are DocuMind AI.

- Answer naturally
- Use provided context
- Explain clearly
- Do not hallucinate
- If answer unavailable say:
"I could not find enough information in the document."
            `,
          },

          {
            role: "user",

            content: `
Context:
${context}

Question:
${question}
            `,
          },
        ],
      });

    // Extract Answer

    const answer =
      completion
        .choices[0]
        .message.content;

    // Existing Chat

    let existingChat =
      await Chat.findOne({

        userId:
          req.user.id,

        documentId,
      });

    // Create Chat

    if (!existingChat) {

      existingChat =
        new Chat({

          userId:
            req.user.id,

          documentId,

          messages: [],
        });
    }

    // Save Message

    existingChat.messages.push({

      question,

      answer,
    });

    await existingChat.save();

    // Response

    res.status(200).json({

      question,

      answer,
    });

  } catch (error) {

    console.log(
      "FULL ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Server error",
    });
  }
};

// ✅ GET USER CHATS

export const getUserChats =
async (req, res) => {

  try {

    const chats =
      await Chat.find({

        userId:
          req.user.id,
      })

      .populate("documentId")

      .sort({
        updatedAt: -1,
      });

    res.status(200).json(
      chats
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error",
    });
  }
};

// ✅ DELETE CHAT

export const deleteChat =
async (req, res) => {

  try {

    await Chat.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      message:
        "Chat deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Server error",
    });
  }
};