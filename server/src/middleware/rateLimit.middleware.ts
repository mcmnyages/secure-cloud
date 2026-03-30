import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

// Generic limiter (global)
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});

// Strict limiter (auth routes)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // login attempts
  message: {
    message: "Too many login attempts. Try again later.",
  },
});