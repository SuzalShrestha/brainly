import { Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { Share } from '../models/share.model';
import { v4 as uuidv4 } from 'uuid';
import { Content } from '../models/content.model';
import { RequestWithUser } from '../types/express';
const shareContent = asyncHandler(
    async (req: RequestWithUser, res: Response) => {
        const { share } = req.body;
        if (!share) {
            return res.status(400).json({ message: 'Link not shareable' });
        }
        const uuidHash = uuidv4();
        await Share.create({
            hash: uuidHash,

            user: req.user?._id,
        });
        await Content.updateMany(
            {
                user: req.user?._id,
            },
            {
                isShared: true,
            }
        );
        return res.status(200).json({
            data: {
                hash: uuidHash,
                shareUrl: `${process.env.BASE_URL}/brain/${uuidHash}`,
            },
        });
    }
);
const getSharedContent = asyncHandler(
    async (req: RequestWithUser, res: Response) => {
        const { hash } = req.params;
        if (!hash) {
            return res.status(400).json({ error: { message: 'Invalid hash' } });
        }
        const sharedContent = await Share.findOne({
            hash,
        });
        if (!sharedContent) {
            return res
                .status(404)
                .json({ error: { message: 'Content not found' } });
        }
        // if (sharedContent.user.toString() === req.user?._id!.toString()) {
        //     return res.status(200).json({
        //         data: [],
        //         error: { message: 'Content shared by you' },
        //     });
        // }
        const content = await Content.find({
            user: sharedContent.user,
            isShared: true,
        });
        return res.status(200).json({ data: content });
    }
);
export { shareContent, getSharedContent };
