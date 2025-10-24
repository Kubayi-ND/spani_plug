import { Router } from 'express';
import { getServices, createService } from '../controllers/servicesController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/', getServices);
router.post('/', authMiddleware, createService);

export default router;
