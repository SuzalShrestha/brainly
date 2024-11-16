import { configDotenv } from 'dotenv';
import express from 'express';
import v1 from './v1/router';
const app = express();
app.use(express.json());
configDotenv();
//v1 routes
app.use('/api/v1', v1);

export default app;
