import { Router } from 'express';
import {
    shareContent,
    getSharedContent,
} from '../controllers/share.controller';
const router = Router();
router.route('/share').post(shareContent);
router.route('/:hash').get(getSharedContent);
export default router;
