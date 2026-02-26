import { Router } from 'express';
import { FileController } from './file.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import {UPLOAD_CONFIG} from '../../constants/upload.constants.js';

const router = Router();
const fileController = new FileController();

// Protected Route: Only logged-in users can upload, list, and manage their files
// ####### POST ##########
router.post('/upload', authenticate, upload.array(UPLOAD_CONFIG.BATCH_FIELD, UPLOAD_CONFIG.MAX_COUNT), fileController.upload);
router.post('/:fileId/:versionId/restore', authenticate, fileController.restoreVersion);


// ####### GET ##########
router.get('/:fileId/versions', authenticate, fileController.versions);
router.get('/', authenticate, fileController.list);
router.get('/download/:fileId', authenticate, fileController.download);
router.get('/download/:fileId/versions/:versionId', authenticate, fileController.downloadVersion);

// ####### PATCH ##########
router.patch('/:fileId/rename', authenticate, fileController.rename);

// ####### PUT ##########
router.put('/:fileId', authenticate, upload.single(UPLOAD_CONFIG.SINGLE_FIELD), fileController.updateFile);

// ####### DELETE ##########
router.delete('/:fileId', authenticate, fileController.delete);
router.delete('/bulk-delete', authenticate, fileController.bulkDelete);


export default router;