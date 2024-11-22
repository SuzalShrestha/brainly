import { Router } from 'express';
import { login, signup } from '../controllers/user.controller';
import { createContent, getContent } from '../controllers/content.controller';
import verifyToken from '../middlewares/auth.middleware';
import {
    getSharedContent,
    shareContent,
} from '../controllers/share.controller';
const router = Router();
router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/content').get(verifyToken, getContent);
router.route('/content').post(verifyToken, createContent);
router.route('/brain/share').post(verifyToken, shareContent);
router.route('/brain/:hash').get(verifyToken, getSharedContent);
export default router;
