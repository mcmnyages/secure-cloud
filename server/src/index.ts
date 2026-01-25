import express from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './features/auth/auth.routes.js';
import fileRoutes from './features/files/file.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // CRITICAL: This allows Express to read the body of your request

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes); // Add this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server live on http://localhost:${PORT}`);
});