import { Router } from 'express';
import {
    googleLogin,
    login,
    refreshAccessToken,
} from '../controllers/user.controller';
import { signup } from '../controllers/user.controller';

const router = Router();
router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/google-login').get(googleLogin);
export default router;
