import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { Content } from '../models/content.model';
const createContent = asyncHandler(async (req: Request, res: Response) => {
    try {
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
const deleteContent = asyncHandler(async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        throw error;
    }
});
const favoriteContent = asyncHandler(async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        throw error;
    }
});
const updateContent = asyncHandler(async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        throw error;
    }
});
const searchContent = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Missing search query' });
        }
        const content = await Content.find({
            $text: { $search: q as string },
        });
        return res
            .status(200)
            .json({ data: { data: content, total: content.length } });
    } catch (error) {
        throw error;
    }
});
export {
    createContent,
    getContent,
    deleteContent,
    favoriteContent,
    updateContent,
    searchContent,
};
