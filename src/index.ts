// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, this is your TypeScript backend!');
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

startServer();
