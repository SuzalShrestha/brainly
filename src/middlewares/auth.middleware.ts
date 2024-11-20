import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
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
            const decodeToken = jwt.decode(req.cookies.token);
            if (!decodeToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const decodedToken = decodeToken as { _id: string };
            const user = await User.findById(decodedToken._id).select(
                '-password'
            );
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            //@ts-ignore
            req.user = user;
            next();
        } catch (error) {
            throw error;
        }
    }
);
export default verifyToken;
