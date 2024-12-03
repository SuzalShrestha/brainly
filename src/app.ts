import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/v1.route';
import { configDotenv } from 'dotenv';
import corsOptions from './utils/cors-options';

const app = express();
configDotenv();

// Apply CORS with options
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Routes
app.use('/api/v1', router);

export default app;
