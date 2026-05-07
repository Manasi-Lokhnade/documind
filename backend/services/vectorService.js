import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

import {
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";

import {
  OpenAIEmbeddings,
} from "@langchain/openai";

import {
  MemoryVectorStore,
} from "langchain/vectorstores/memory";

// ✅ OpenAI Embeddings
const embeddings =
  new OpenAIEmbeddings({
    openAIApiKey:
      process.env.OPENAI_API_KEY,
  });

// ✅ Store vector stores in memory
const vectorStores = {};

// ✅ Create Vector Store
export const createVectorStore =
async (documentId, text) => {

  // Skip if already exists
  if (vectorStores[documentId]) {
    return vectorStores[documentId];
  }

  // Split text
  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

  // Create chunks
  const docs =
    await splitter.createDocuments([text]);

  // Create vector store
  const vectorStore =
    await MemoryVectorStore.fromDocuments(
      docs,
      embeddings
    );

  // Save in memory
  vectorStores[documentId] =
    vectorStore;

  console.log(
    "Embeddings created successfully"
  );

  return vectorStore;
};

// ✅ Get Existing Vector Store
export const getVectorStore =
(documentId) => {

  return vectorStores[documentId];
};