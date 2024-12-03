import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';
import logger from '../utils/logger';

// Override the stream method by telling Morgan to use our custom logger
const stream: StreamOptions = {
    // Use the http severity
    write: (message: string) => logger.http(message.trim()),
};

// Build the morgan middleware
const morganMiddleware = morgan(
    // Define message format string (this is the default format)
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',
    // Options: override stream and skip logic
    {
        stream,
        // Skip logging if in production and successful response
        skip: (req: Request, res: Response) =>
            process.env.NODE_ENV === 'production' && res.statusCode < 400,
    }
);

export default morganMiddleware;
