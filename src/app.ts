import express, { NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/v1.route';
import { configDotenv } from 'dotenv';
import logger from './utils/logger';
import morganMiddleware from './middlewares/morgan.middleware';
import errorMiddleware from './middlewares/error.middleware';
import notFoundMiddleware from './middlewares/notfound.middleware';

const app = express();
configDotenv();

logger.info('Server starting...');

// Apply CORS with options
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie'],
    })
);

// Logging middleware
app.use(morganMiddleware);

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable pre-flight requests for all routes
app.options(
    '*',
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie'],
    })
);

// Request logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();

    // Log request
    logger.info(`Incoming ${req.method} request to ${req.url}`, {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info(`Request completed in ${duration}ms`, {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
        });
    });

    next();
});

// Error logging middleware
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        logger.error('Error occurred:', {
            error: err.message,
            stack: err.stack,
            method: req.method,
            url: req.url,
            ip: req.ip,
        });
        next(err);
    }
);
// Routes
app.use('/api/v1', router);
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});
app.get('*', notFoundMiddleware);
// Error middleware
app.use(errorMiddleware);
// Log unhandled rejections
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Rejection:', {
        error: reason.message,
        stack: reason.stack,
    });
});

export default app;
