import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { Share } from '../models/share.model';
import { v4 as uuidv4 } from 'uuid';
import { Content } from '../models/content.model';
const shareContent = asyncHandler(async (req: Request, res: Response) => {
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
const getSharedContent = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { hash } = req.params;
        if (!hash) {
            return res.status(400).json({ message: 'Invalid hash' });
        }
        const sharedContent = await Share.findOne({
            hash,
        });
        if (!sharedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        if (sharedContent.user.toString() === req.user?._id!.toString()) {
            return res.status(200).json({ message: 'Content shared by you' });
        }
        const content = await Content.find({
            user: sharedContent.user,
        });
        return res.status(200).json({ content });
    } catch (error) {
        throw error;
    }
});
export { shareContent, getSharedContent };
