// src/index.ts
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is your TypeScript backend!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
