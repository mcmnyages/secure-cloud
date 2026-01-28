import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { sendVerificationEmail } from '../email/email.controller.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
       // 1. Create user
      const user = await this.authService.registerUser(email, password, name);
       // Trigger verification email
      await sendVerificationEmail({ body: { userId: user.id, email } } as any, res);
      // 4. Respond immediately
    res.status(201).send({
       message: 'Account created. Check your email to verify.',
    });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginUser(email, password);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}


