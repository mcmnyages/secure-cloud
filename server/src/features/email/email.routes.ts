import { Router } from 'express';
import {
    sendVerificationEmail, 
    verifyEmail, 
    requestPasswordReset,
    resetPassword
 } from './email.controller.js';

const router = Router();

router.post('/send-verification', sendVerificationEmail);
router.get('/verify', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
