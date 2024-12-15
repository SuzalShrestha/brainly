import { Router } from 'express';
import {
    login,
    refreshAccessToken,
    signup,
} from '../controllers/user.controller';
import {
    createContent,
    deleteContent,
    favoriteContent,
    getContent,
    searchContent,
    updateContent,
} from '../controllers/content.controller';
import verifyToken from '../middlewares/auth.middleware';
import {
    getSharedContent,
    shareContent,
} from '../controllers/share.controller';
const router = Router();
router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/refresh').post(refreshAccessToken);
router.use(verifyToken);
router.route('/content').get(getContent);
router.route('/content').post(createContent);
router.route('/content/:id').delete(deleteContent);
router.route('/content/search').get(searchContent);
router.route('/favorite/:id').post(favoriteContent);
router.route('/brain/share').post(shareContent);
router.route('/brain/:hash').get(getSharedContent);
router.route('/content/:id').put(updateContent);

export default router;
