import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { transporter } from './features/email/email.service.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './features/auth/auth.routes.js';
import fileRoutes from './features/files/file.routes.js';
import { emailRoutes } from './features/email/index.js';
import { multerErrorHandler } from './middleware/errors/multerError.middleware.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';


const app = express();

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// Ensure uploads folder exists on the server disk
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.static(path.resolve("public")));
app.use("/assets", express.static(path.resolve("assets")));

// Middleware
app.use('/uploads', express.static(uploadDir));
app.use(helmet()); // Basic security
app.use(morgan('dev')); // Logging
app.use(express.json()); // CRITICAL: This allows Express to read the body of your request
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// Routes
app.get('/health', (req, res) => res.status(200).send('OK'));// Health check endpoint remember to not rate limit this endpoint in production, as monitoring tools will hit it frequently

app.use('/api', globalRateLimiter); // Apply global rate limiter to all routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes); 
app.use('/api/email', emailRoutes);

// I am told this must be the last middleware in the chain, to catch any errors from above routes or middlewares
app.use(multerErrorHandler); // Handle Multer errors before the general error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server live on http://localhost:${PORT}`);
});