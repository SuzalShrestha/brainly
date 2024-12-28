import { NextFunction, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { RequestWithUser } from '../types/express';

const verifyToken = asyncHandler(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        let token: string | undefined;

        // Check for Bearer token in Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // If no Bearer token, check for cookie
        if (!token && req.cookies.accessToken) {
            token = req.cookies.token;
        }
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET!
            ) as {
                _id: string;
            };

            const user = await User.findById(decoded._id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user;
            next();
        } catch {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
);

export default verifyToken;
