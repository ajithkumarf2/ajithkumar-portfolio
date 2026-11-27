import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';

const router = Router();

router.post('/', ContactController.submitContact);
router.get('/', ContactController.listContacts);

export default router;
