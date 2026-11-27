import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';

const router = Router();

router.post('/', AnalyticsController.logEvent);
router.get('/summary', AnalyticsController.getAnalyticsSummary);

export default router;
