import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const login = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName && !email) {
            return res
                .status(400)
                .json({ message: 'Username or email is missing' });
        }

        const user = await User.findOne({
            $or: [{ userName }, { email }],
        });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }
        const isValid = bcrypt.compareSync(password, user?.password!);
        if (!isValid) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        return res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24,
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                priority: 'high',
            })
            .status(200)
            .json({
                data: {
                    user: {
                        _id: user._id,
                        userName: user.userName,
                        email: user.email,
                        name: user.name,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                },
            });
    } catch (error) {
        throw error;
    }
});
const signup = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userName, password, email, name } = req.body;
        if (!userName || !password) {
            return res
                .status(400)
                .json({ message: 'Username or password is missing' });
        }
        const hash = bcrypt.hashSync(password, 10);
        const existingUser = await User.findOne({
            $or: [{ userName }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                message:
                    existingUser.userName === userName
                        ? 'Username already exists'
                        : 'Email already exists',
            });
        }

        const newUser = await User.create({
            userName,
            password: hash,
            email,
            name,
        });

        const user = await User.findById(newUser?._id).select('-password');
        return res.status(201).json(user);
    } catch (error) {
        throw error;
    }
});
export { login, signup };
