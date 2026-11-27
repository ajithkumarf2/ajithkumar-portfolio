import { Router } from 'express';
import { ChatController } from '../controllers/chatController.js';

const router = Router();

router.post('/stream', ChatController.streamChat);
router.post('/feedback', ChatController.submitFeedback);

export default router;
