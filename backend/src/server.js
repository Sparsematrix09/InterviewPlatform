import express from 'express';
import path from 'path';
import { ENV } from './lib/env.js';
import { connectDB } from "./lib/db.js";
import cors from 'cors';
import { serve } from "inngest/express";
import { inngest, functions } from './lib/inngest.js';

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

// API routes
app.get('/health', (req, res) => {
  res.status(200).json({ msg: 'api is up and running' });
});
app.get('/books', (req, res) => {
  res.status(200).json({ msg: 'this is book endpoint' });
});

// Serve frontend in production
if (ENV.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  console.log('Serving frontend from:', frontendPath);

  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Start server
const startServer = async () => {
  try {
    await connectDB();  
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
