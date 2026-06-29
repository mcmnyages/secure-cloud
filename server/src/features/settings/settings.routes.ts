import express from 'express';
import { SettingsController }from './settings.controller.js';
import {authenticate} from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import  {UPLOAD_CONFIG} from '../../constants/upload.constants.js'

const router = express.Router();

const settingsController = new SettingsController();

router.get('/user', authenticate, settingsController.getUserSettings);
router.put('/user', authenticate, upload({folder:'avatar'}).single('avatar'),  settingsController.updateUser);
router.patch("/password",authenticate, settingsController.updatePassword);
router.put('/user/settings', authenticate, settingsController.updateUserSettings);
router.put('/user/profile', authenticate, settingsController.updateUserProfile);

export default router;