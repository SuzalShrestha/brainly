import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { Content } from '../models/content.model';
const createContent = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { title, link, type, tags, content } = req.body;
        if (!title || !link || !type || !tags || !content) {
            return res.status(400).json({ message: 'Missing content details' });
        }
        await Content.create({
            title,
            link,
            type,
            tags,
            content,
            //@ts-ignore
            user: req.user?._id,
        });
        return res.status(200).json({ message: 'Content created' });
    } catch (error) {
        throw error;
    }
});
const getContent = asyncHandler(async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const content = await Content.find({
            //@ts-ignore
            user: req.user._id,
        });
        return res.status(200).json({ data: content });
    } catch (error) {
        throw error;
    }
});
export { createContent, getContent };
