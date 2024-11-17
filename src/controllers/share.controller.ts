import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import jwt from 'jsonwebtoken';
import { Share } from '../models/share.model';
import { v4 as uuidv4 } from 'uuid';
const createShare = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { share } = req.body;
        if (!share) {
            return res.status(400).json({ message: 'Link not shareable' });
        }
        if (!req.cookies.token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const parseJWT = jwt.decode(req.cookies.token);
        if (!parseJWT) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const uuidHash = uuidv4();
        await Share.create({
            hash: uuidHash,
            //@ts-ignore
            user: parseJWT._id,
        });
        return res.status(200).json({ hash: uuidHash });
    } catch (error) {
        throw error;
    }
});
export { createShare };
