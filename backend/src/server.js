import express from 'express';
import path from 'path';
import {ENV} from './lib/env.js';
import { connectDB } from "./lib/db.js";
import cors from 'cors';
import { serve } from "inngest/express";
import { inngest, functions } from './lib/inngest.js';
const app = express();

const __dirname = path.resolve();
//middleware
app.use(express.json());
//credentils true to allow cookies from frontend
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use("/api/inngest",serve({client:inngest,functions}))

app.get('/health', (req, res) => {
  res.status(200).json({msg:'api is up and running'});
});
app.get('/books', (req, res) => {
  res.status(200).json({msg:'this is book endpoint'});
});

//make deployment ready
if(ENV.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,'../frontend/dist')))

  app.get("/{*any", (req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/dist/index.html'))
  });
}


const startServer = async () => {
  try {
    await connectDB();  
    app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`)
  connectDB();
});
  } catch (error) {
    console.error("❌ Failed to start server", error);
    process.exit(1);//exit with failure
  }
};
startServer();