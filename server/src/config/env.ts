import dotenv from "dotenv";

dotenv.config(); // Load .env

// Split ALLOWED_ORIGINS by comma and trim spaces
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim());

export const env = {
  baseUrl: process.env.BASE_URL || "http://localhost:5000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  allowedOrigins,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  email: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || ""
  }
};