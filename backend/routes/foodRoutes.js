import { Router } from 'express';
const router = Router();
import foodController from '../controllers/foodController.js';
const { getAllFoods, getFoodById, createFood, updateFood, deleteFood } = foodController;

router.get('/', getAllFoods);
router.get('/:id', getFoodById);

router.post('/', createFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;