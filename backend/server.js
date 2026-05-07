import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// LOAD ENV

dotenv.config();

const app = express();

// MIDDLEWARE

app.use(cors());

app.use(express.json());

// SERVE PDF UPLOADS

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

// ROUTES

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

// TEST ROUTE

app.get("/", (req, res) => {

  res.send(
    "API is running..."
  );
});

// MONGODB CONNECTION

mongoose
  .connect(
    process.env.MONGO_URI
  )

  .then(() =>
    console.log(
      "MongoDB Connected ✅"
    )
  )

  .catch((err) =>
    console.log(err)
  );

// SERVER START

app.listen(5000, () => {

  console.log(
    "Server running on port 5000 🚀"
  );
});