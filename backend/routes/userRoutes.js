import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authorizeSelfOrAdmin } from '../middleware/authorizeSelfOrAdmin.js';
import {
  createUser,
  deleteUser,
  getProfile,
  getUserById,
  listUsers,
  updateUser,
} from '../controllers/userController.js';
import {
  createUserValidators,
  listUsersValidators,
  updateUserValidators,
  userIdValidator,
} from '../validators/userValidators.js';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.get('/', authenticate, authorizeRoles('admin'), ...listUsersValidators, listUsers);
router.post('/', authenticate, authorizeRoles('admin'), ...createUserValidators, createUser);
router.get('/:id', authenticate, ...userIdValidator, authorizeSelfOrAdmin('id'), getUserById);
router.put('/:id', authenticate, ...userIdValidator, authorizeSelfOrAdmin('id'), ...updateUserValidators, updateUser);
router.delete('/:id', authenticate, authorizeRoles('admin'), ...userIdValidator, deleteUser);

export default router;