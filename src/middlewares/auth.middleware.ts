import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const verifyToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token: string | undefined;

            // Check for Bearer token in Authorization header
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }

            // If no Bearer token, check for cookie
            if (!token && req.cookies.token) {
                token = req.cookies.token;
            }

            if (!token) {
                return res
                    .status(401)
                    .json({ message: 'Unauthorized - No token provided' });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                    _id: string;
                };

                const user = await User.findById(decoded._id).select(
                    '-password'
                );

                if (!user) {
                    return res.status(401).json({ message: 'User not found' });
                }
                //@ts-ignore
                req.user = user;
                next();
            } catch (error) {
                return res
                    .status(401)
                    .json({ message: 'Invalid or expired token' });
            }
        } catch (error) {
            throw error;
        }
    }
);

export default verifyToken;
