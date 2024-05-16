const express = require('express');
const dotenv = require('dotenv');
const app = express();
import { Request, Response } from 'express';
dotenv.config();

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port: string | 3000 = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

