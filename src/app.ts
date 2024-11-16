import { configDotenv } from 'dotenv';
import express from 'express';
const app = express();
app.use(express.json());
configDotenv();

export default app;
