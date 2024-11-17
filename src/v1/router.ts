import { NextFunction, Router } from 'express';
import { User } from '../models/user.model';
import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
router.route('/login').post(
    asyncHandler(async (req: Request, res: Response) => {
        try {
            const { userName, password } = req.body;
            const user = await User.findOne({ userName });
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
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
            return res
                .cookie('token', token)
                .status(200)
                .json({ message: 'Login successful' });
        } catch (error) {
            throw error;
        }
    })
);
router.route('/signup').post(
    asyncHandler(async (req: Request, res: Response) => {
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
    })
);
router.route('/content').get(
    asyncHandler(async (req: Request, res: Response) => {
        try {
            return res.status(200).json({ message: 'Content' });
        } catch (error) {
            throw error;
        }
    })
);
export default router;
