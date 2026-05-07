import dotenv from "dotenv";
dotenv.config();

import { ChromaClient }
from "chromadb";

import {
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";

import {
  OpenAIEmbeddings,
} from "@langchain/openai";

// ✅ Chroma Client
const client = new ChromaClient();

// ✅ OpenAI Embeddings
const embeddings =
  new OpenAIEmbeddings({
    openAIApiKey:
      process.env.OPENAI_API_KEY,
  });

// ✅ Store Document Embeddings
export const storeDocumentEmbeddings =
async (documentId, text) => {

  // Create collection
  const collection =
    await client.getOrCreateCollection({
      name: documentId,
    });

  // Split text
  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

  // Create chunks
  const docs =
    await splitter.createDocuments([text]);

  // Store each chunk
  for (let i = 0; i < docs.length; i++) {

    const chunk =
      docs[i].pageContent;

    // Create embedding
    const embedding =
      await embeddings.embedQuery(chunk);

    // Store in Chroma
    await collection.add({
      ids: [`${documentId}-${i}`],

      embeddings: [embedding],

      documents: [chunk],
    });
  }

  console.log(
    "Embeddings stored successfully"
  );
};

// ✅ Search Similar Chunks
export const searchSimilarChunks =
async (documentId, question) => {

  // Get collection
  const collection =
    await client.getOrCreateCollection({
      name: documentId,
    });

  // Embed question
  const questionEmbedding =
    await embeddings.embedQuery(question);

  // Semantic search
  const results =
    await collection.query({
      queryEmbeddings:
        [questionEmbedding],

      nResults: 4,
    });

  return results.documents[0].join("\n");
};