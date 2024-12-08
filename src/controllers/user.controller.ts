import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};
const login = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Username or email is missing' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }
        //@ts-ignore
        const isValid = await user.isPasswordCorrect(password);
        if (!isValid) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user?._id);
        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false,
        });
        return (
            res
                //cookie are handled in apiClient middlware and authjs sessions
                // .cookie('token', token, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === 'production',
                //     maxAge: 1000 * 60 * 60 * 24,
                //     sameSite:
                //         process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                //     priority: 'high',
                // })
                .status(200)
                .json({
                    data: {
                        user: {
                            _id: user._id,
                            userName: user.userName,
                            email: user.email,
                            name: user.name,
                            accessToken,
                            refreshToken,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        },
                    },
                })
        );
    } catch (error) {
        throw error;
    }
});
const signup = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userName, password, email, name } = req.body;
        if (!userName || !password || !email || !name) {
            return res
                .status(400)
                .json({ message: 'Username or password is missing' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password is too short' });
        }
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

        await User.create({
            userName,
            password,
            email,
            name,
        });
        return res.status(201).json({
            data: {
                message: 'User created successfully',
            },
        });
    } catch (error) {
        throw error;
    }
});
export { login, signup };
