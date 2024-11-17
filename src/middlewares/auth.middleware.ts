import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import jwt from 'jsonwebtoken';
const verifyToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.cookies.token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const isVerified = jwt.verify(
                req.cookies.token,
                process.env.JWT_SECRET!
            );
            if (!isVerified) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = jwt.decode(req.cookies.token);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user;
            next();
        } catch (error) {
            throw error;
        }
    }
);
export default verifyToken;
