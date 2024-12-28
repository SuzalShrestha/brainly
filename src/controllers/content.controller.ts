import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { Content } from '../models/content.model';
import { RequestWithUser } from '../types/express';
const createContent = asyncHandler(
    async (req: RequestWithUser, res: Response) => {
        const { title, link, type, tags, content } = req.body;
        if (!title || !type || !tags || !content) {
            return res.status(400).json({ message: 'Missing content details' });
        }
        await Content.create({
            title,
            link,
            type,
            tags,
            content,
            user: req.user?._id,
        });
        return res.status(200).json({ message: 'Content created' });
    }
);
const getContent = asyncHandler(async (req: RequestWithUser, res: Response) => {
    const content = await Content.find({
        user: req.user._id,
    });
    return res.status(200).json({ data: content });
});
const deleteContent = asyncHandler(
    async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing content id' });
        }
        const content = await Content.deleteOne({
            _id: id,
        });
        if (content.deletedCount === 0) {
            return res.status(404).json({ message: 'Content not found' });
        }
        return res.status(200).json({ data: { message: 'Content deleted' } });
    }
);
const favoriteContent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing content id' });
    }
    //toggle isFavorite
    const content = await Content.findById(id);
    if (!content) {
        return res.status(404).json({ message: 'Content not found' });
    }
    await Content.findByIdAndUpdate(id, {
        isFavorite: !content.isFavorite,
    });
    return res.status(200).json({ data: { message: 'Content favorited' } });
});
const updateContent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing content id' });
    }
    const { title, link, type, tags, content } = req.body;
    await Content.findByIdAndUpdate(id, {
        title,
        link,
        type,
        tags,
        content,
    });
    return res.status(200).json({ data: { message: 'Content updated' } });
});
const searchContent = asyncHandler(
    async (req: RequestWithUser, res: Response) => {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Missing search query' });
        }
        const escapeRegex = (text: string) =>
            text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(escapeRegex(q as string), 'i');
        const content = await Content.find({
            user: req.user._id,
            $or: [{ title: regex }, { link: regex }, { content: regex }],
        });
        return res
            .status(200)
            .json({ data: { data: content, total: content.length } });
    }
);
export {
    createContent,
    getContent,
    deleteContent,
    favoriteContent,
    updateContent,
    searchContent,
};
