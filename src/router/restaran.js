import express from 'express';
import { getRestaurants, createRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant, generateQR, } from '../controller/restaranController.js';
import { verifyToken, roleGuard } from '../middleware/auth.js';
import { uploadRestaurantImages } from '../middleware/upload.js';
import { validateCreateRestaurant, validateUpdateRestaurant } from '../validator/restaurantValidator.js';

const router = express.Router();

router.get('/', verifyToken, roleGuard(['admin']), getRestaurants);
router.post('/', verifyToken, roleGuard(['admin']), uploadRestaurantImages, createRestaurant);
router.get('/:id', verifyToken, roleGuard(['admin']), getRestaurantById);
router.put('/:id', verifyToken, roleGuard(['admin']), uploadRestaurantImages, updateRestaurant);
router.delete('/:id', verifyToken, roleGuard(['admin']), deleteRestaurant);
router.post('/:id/qr', verifyToken, roleGuard(['admin']), generateQR);

export default router;
