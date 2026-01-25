import { Router } from 'express';
import { FileController } from './file.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = Router();
const fileController = new FileController();

// Protected Route: Only logged-in users can upload
router.get('/', authenticate, fileController.list);
router.get('/download/:fileId', authenticate, fileController.download);
router.post('/upload', authenticate, upload.single('file'), fileController.upload);
router.delete('/:fileId', authenticate, fileController.delete);

export default router;