import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getTaskHistory } from '../controllers/historyController.js';
import { listHistoryValidators } from '../validators/historyValidators.js';

const router = Router({ mergeParams: true });

router.get('/', authenticate, ...listHistoryValidators, getTaskHistory);

export default router;