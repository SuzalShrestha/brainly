import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { Share } from '../models/share.model';
import { v4 as uuidv4 } from 'uuid';
const createShare = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { share } = req.body;
        if (!share) {
            return res.status(400).json({ message: 'Link not shareable' });
        }
        const uuidHash = uuidv4();
        await Share.create({
            hash: uuidHash,
            user: req.user?._id,
        });
        return res.status(200).json({ hash: uuidHash });
    } catch (error) {
        throw error;
    }
});
export { createShare };
