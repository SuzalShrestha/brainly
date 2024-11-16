import { NextFunction, Router } from 'express';
import { User } from '../models/user.model';
import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';

const router = Router();
router.route('/login').post(
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            //password hashing in v2
            const user = await User.findOne({ username, password });
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Invalid username or password' });
            }
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    })
);
router.route('/signup').post(
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res
                    .status(400)
                    .json({ message: 'Username or password is missing' });
            }
            const user = await User.create({ username, password });
            return res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    })
);
router.route('/content').get(
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({ message: 'Content' });
        } catch (error) {
            next(error);
        }
    })
);
export default router;
