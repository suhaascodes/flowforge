import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  assignTask,
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
  updateTaskStatus,
} from '../controllers/taskController.js';
import {
  assignTaskValidators,
  createTaskValidators,
  listTasksValidators,
  taskIdValidator,
  updateStatusValidators,
  updateTaskValidators,
} from '../validators/taskValidators.js';

const router = Router();

router.get('/', authenticate, ...listTasksValidators, listTasks);
router.post('/', authenticate, ...createTaskValidators, createTask);
router.get('/:id', authenticate, ...taskIdValidator, getTaskById);
router.put('/:id', authenticate, ...taskIdValidator, ...updateTaskValidators, updateTask);
router.delete('/:id', authenticate, authorizeRoles('admin'), ...taskIdValidator, deleteTask);
router.patch('/:id/status', authenticate, ...taskIdValidator, ...updateStatusValidators, updateTaskStatus);
router.patch('/:id/assignment', authenticate, ...taskIdValidator, ...assignTaskValidators, assignTask);

export default router;