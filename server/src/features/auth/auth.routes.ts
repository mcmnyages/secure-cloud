import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { RegisterSchema, LoginSchema } from './auth.schema.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { prisma } from '../../../lib/prisma.js';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);
router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: (req as any).userId },
    select: { email: true, name: true, storageUsed: true, storageLimit: true }
  });
  res.json(user);
});

export default router;