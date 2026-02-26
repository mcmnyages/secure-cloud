import express from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './features/auth/auth.routes.js';
import fileRoutes from './features/files/file.routes.js';
import { emailRoutes } from './features/email/index.js';
import { multerErrorHandler } from './middleware/errors/multerError.middleware.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://secure-cloud-delta.vercel.app' // Your future production URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Ensure uploads folder exists on the server disk
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}



// Middleware
app.use('/uploads', express.static(uploadDir));
app.use(express.json()); // CRITICAL: This allows Express to read the body of your request
app.use(helmet()); // Basic security
app.use(morgan('dev')); // Logging


// Routes
app.get('/health', (req, res) => res.status(200).send('OK'));
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