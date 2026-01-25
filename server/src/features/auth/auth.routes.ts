import { Router } from 'express';
import { AuthService } from './auth.controller.js';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const user = await authService.registerUser(email, password, name);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

export default router;