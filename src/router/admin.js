import express from 'express';
import { getAllAdmins, createAdmin, getAdminById, updateAdmin, deleteAdmin, toggleAdmin, } from '../controller/adminController.js';
import { verifyToken, roleGuard } from '../middleware/auth.js';
import { validateCreateAdmin, validateUpdateAdmin } from '../validator/adminValidator.js';

const router = express.Router();

router.get('/', verifyToken, roleGuard(['superadmin']), getAllAdmins);
router.post('/', verifyToken, roleGuard(['superadmin']), validateCreateAdmin, createAdmin);
router.get('/:id', verifyToken, roleGuard(['superadmin']), getAdminById);
router.put('/:id', verifyToken, roleGuard(['superadmin']), validateUpdateAdmin, updateAdmin);
router.delete('/:id', verifyToken, roleGuard(['superadmin']), deleteAdmin);
router.patch('/:id/toggle', verifyToken, roleGuard(['superadmin']), toggleAdmin);

export default router;
