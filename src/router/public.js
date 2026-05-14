import express from 'express';
import { getPublicRestaurants, getPublicMenu, getPublicCategories } from '../controller/publicController.js';

const router = express.Router();

router.get('/restaurants', getPublicRestaurants);
router.get('/menu/:restaurantId', getPublicMenu);
router.get('/menu/:restaurantId/categories', getPublicCategories);

export default router;
