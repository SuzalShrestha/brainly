import { Router } from 'express';
import {
    deleteContent,
    getContent,
    searchContent,
    updateContent,
} from '../controllers/content.controller';
import { createContent } from '../controllers/content.controller';

const router = Router();
router.route('/').get(getContent);
router.route('/').post(createContent);
router.route('/:id').delete(deleteContent);
router.route('/search').get(searchContent);
router.route('/:id').put(updateContent);
export default router;
