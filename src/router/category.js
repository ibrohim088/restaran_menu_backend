import express from 'express';
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory, toggleCategory, } from '../controller/categoryController.js';
import { verifyToken, roleGuard } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateCreateCategory, validateUpdateCategory } from '../validator/categoryValidator.js';

const router = express.Router();

router.get('/restaurants/:restaurantId', verifyToken, roleGuard(['admin']), getCategories);
router.post('/restaurants/:restaurantId', verifyToken, roleGuard(['admin']), upload.single('image'), createCategory);
router.get('/:id', verifyToken, roleGuard(['admin']), getCategoryById);
router.put('/:id', verifyToken, roleGuard(['admin']), upload.single('image'), updateCategory);
router.delete('/:id', verifyToken, roleGuard(['admin']), deleteCategory);
router.patch('/:id/toggle', verifyToken, roleGuard(['admin']), toggleCategory);

export default router;
