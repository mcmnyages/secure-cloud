import express from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './features/auth/auth.routes.js';
import fileRoutes from './features/files/file.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Ensure uploads folder exists on the server disk
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use('/uploads', express.static(uploadDir));
app.use(cors());
app.use(express.json()); // CRITICAL: This allows Express to read the body of your request
app.use(helmet()); // Basic security
app.use(morgan('dev')); // Logging


// Routes
app.get('/health', (req, res) => res.status(200).send('OK'));
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes); // Add this


app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server live on http://localhost:${PORT}`);
});