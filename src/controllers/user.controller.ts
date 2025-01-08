import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import { User } from '../models/user.model';
import { ApiError } from '../utils/api-error';
import { ApiResponse } from '../utils/api-response';
import jwt from 'jsonwebtoken';
interface RefreshPayloadWithId {
    _id: string;
}
const generateAccessAndRefereshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        if (!accessToken || !refreshToken) {
            throw new Error('Failed to generate tokens');
        }
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(
            'Something went wrong while generating referesh and access tokens' +
                error
        );
    }
};
const login = asyncHandler(async (req: Request, res: Response) => {
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
    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) {
        return res
            .status(401)
            .json({ message: 'Invalid username or password' });
    }
    //generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id.toString()
    );

    return res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            priority: 'high',
        })
        .status(200)
        .json({
            data: {
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    accessToken: accessToken,
                    //sent to nextjs to store in cookie manually only for login
                    refreshToken: refreshToken,
                },
            },
        });
});
const signup = asyncHandler(async (req: Request, res: Response) => {
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
});
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(403, 'unauthorized request');
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as RefreshPayloadWithId;
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(403, 'Invalid refresh token');
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(403, 'Refresh token is expired or used');
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefereshTokens(user._id.toString());
        return res
            .status(200)
            .cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                priority: 'high',
            })
            .json(
                new ApiResponse(200, { accessToken }, 'Access token refreshed')
            );
    } catch (error) {
        throw new ApiError(
            403,
            (error as Error)?.message || 'Invalid refresh token'
        );
    }
});
const googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { accessToken: GAccessToken } = req.query;
    const IsGoogleAccountExist = await fetch(
        'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        {
            headers: {
                Authorization: `Bearer ${GAccessToken}`,
            },
        }
    );
    const googleUser = await IsGoogleAccountExist.json();
    if (!googleUser) {
        throw new ApiError(404, 'Invalid Access Token');
    }
    const user = await User.findOne({ email: googleUser.email });
    let newUser;
    if (!user) {
        await User.create(
            {
                email: googleUser.email,
                password: googleUser.id,
                userName: googleUser.name.toLowerCase() + googleUser.id,
            },
            {
                validateBeforeSave: false,
            }
        );
        newUser = await User.findOne({ email: googleUser.email });
    } else {
        newUser = user;
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        newUser!._id.toString()
    );
    return res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            priority: 'high',
        })
        .status(200)
        .json({
            data: {
                user: {
                    _id: newUser?._id,
                    email: newUser?.email,
                    accessToken: accessToken,
                    //sent to nextjs to store in cookie manually only for login
                    refreshToken: refreshToken,
                },
            },
        });
});
export { login, signup, refreshAccessToken, googleLogin };
