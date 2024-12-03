import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err.message);
    const statusCode = res.statusCode || 500;
    res.status(statusCode).json({ message: `${err.message}` });
};

export default errorMiddleware;
