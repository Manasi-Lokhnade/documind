import fs from "fs";
import pdf from "pdf-parse-fixed";

import Document from "../models/Document.js";

import {
  createVectorStore,
} from "../services/vectorService.js";

// ✅ Upload Document
export const uploadDocument =
async (req, res) => {

  try {

    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Save document
    const newDocument =
      new Document({
        userId: req.user.id,
        fileName: req.file.filename,
      });

    await newDocument.save();

    // File path
    const filePath =
      `uploads/${req.file.filename}`;

    // Read PDF
    const dataBuffer =
      fs.readFileSync(filePath);

    // Extract PDF text
    const pdfData =
      await pdf(dataBuffer);

    const documentText =
      pdfData.text;

    console.log("PDF TEXT:");
    console.log(documentText);

    // ✅ Create embeddings ONCE
    await createVectorStore(
      newDocument._id.toString(),
      documentText
    );

    // Final response
    res.status(201).json({
      message:
        "Document uploaded successfully",

      document: newDocument,
    });

  } catch (error) {

    console.log(
      "UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ Get User Documents
export const getUserDocuments =
async (req, res) => {

  try {

    const documents =
      await Document.find({
        userId: req.user.id,
      });

    res.status(200).json(documents);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};