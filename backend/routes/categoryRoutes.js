import { Router } from 'express';
const router = Router();
import { getAllCategories } from '../controllers/categoryController.js';

router.get('/', getAllCategories);

export default router;