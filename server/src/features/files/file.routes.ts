import { Router } from 'express';
import { FileController } from './file.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import {UPLOAD_CONFIG} from '../../constants/upload.constants.js';

const router = Router();
const fileController = new FileController();

// Protected Route: Only logged-in users can upload
router.get('/', authenticate, fileController.list);
router.get('/download/:fileId', authenticate, fileController.download);
router.post('/upload', authenticate, upload.array(UPLOAD_CONFIG.BATCH_FIELD, UPLOAD_CONFIG.MAX_COUNT), fileController.upload);
router.patch('/:fileId/rename', authenticate, fileController.rename);
router.put('/:fileId', authenticate, upload.single(UPLOAD_CONFIG.SINGLE_FIELD), fileController.updateFile);
router.delete('/:fileId', authenticate, fileController.delete);
router.post('/bulk-delete', authenticate, fileController.bulkDelete);

export default router;