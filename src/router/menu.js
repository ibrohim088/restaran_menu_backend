import express from 'express';
import { getMenuItems, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem, toggleAvailability, } from '../controller/menuController.js';
import { verifyToken, roleGuard } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateCreateMenuItem, validateUpdateMenuItem } from '../validator/menuValidator.js';

const router = express.Router();

router.get('/categories/:categoryId', verifyToken, roleGuard(['admin']), getMenuItems);
router.post('/categories/:categoryId', verifyToken, roleGuard(['admin']), upload.single('image'), createMenuItem);
router.get('/:id', verifyToken, roleGuard(['admin']), getMenuItemById);
router.put('/:id', verifyToken, roleGuard(['admin']), upload.single('image'), updateMenuItem);
router.delete('/:id', verifyToken, roleGuard(['admin']), deleteMenuItem);
router.patch('/:id/toggle', verifyToken, roleGuard(['admin']), toggleAvailability);

export default router;
