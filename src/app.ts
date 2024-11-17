import { configDotenv } from 'dotenv';
import express from 'express';
import v1 from './routes/v1.route';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
configDotenv();
app.get('/health', (_, res) => {
    res.status(200).json({ message: 'Server is running' });
});
//v1 routes
app.use('/api/v1', v1);

export default app;
