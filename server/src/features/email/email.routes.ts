import { Router } from 'express';
import { sendVerificationEmail, verifyEmail } from './email.controller.js';

const router = Router();

router.post('/send-verification', sendVerificationEmail);
router.get('/verify', verifyEmail);

export default router;
