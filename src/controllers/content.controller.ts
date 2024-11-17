import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import jwt from 'jsonwebtoken';
import { Content } from '../models/content.model';
const createContent = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { title, link, type, tags } = req.body;
        if (!title || !link || !type || !tags) {
            return res.status(400).json({ message: 'Missing content details' });
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
        await Content.create({
            title,
            link,
            type,
            tags,
            //@ts-ignore
            user: parseJWT._id,
        });
        return res.status(200).json({ message: 'Content created' });
    } catch (error) {
        throw error;
    }
});
const getContent = asyncHandler(async (req: Request, res: Response) => {
    try {
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
        const content = await Content.find({
            //@ts-ignore
            user: parseJWT._id,
        });
        return res.status(200).json({ content });
    } catch (error) {
        throw error;
    }
});
export { createContent, getContent };
