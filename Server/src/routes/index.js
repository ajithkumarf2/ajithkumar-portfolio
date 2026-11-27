import { Router } from 'express';
import contactRoutes from './contactRoutes.js';
import chatRoutes from './chatRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/contact', contactRoutes);
router.use('/chat', chatRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);

export default router;
