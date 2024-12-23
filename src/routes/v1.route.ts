import { Router } from 'express';
import { favoriteContent } from '../controllers/content.controller';
import verifyToken from '../middlewares/auth.middleware';
import authRouter from './auth.route';
import contentRouter from './content.route';
import brainRouter from './brain.route';
const router = Router();
router.use('/auth', authRouter);
//apply the verifyToken middleware to all routes below this router
router.use(verifyToken);
router.use('/content', contentRouter);
router.use('/brain', brainRouter);
router.route('/favorite/:id').post(favoriteContent);

export default router;
