import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  updateLanguages,
  getLanguages,
  deactivateAccount,
  sendReactivationRequest,
  submitFeedback,
  getUserCallHistory,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes for deactivated users
router.post('/reactivation-request', sendReactivationRequest);

// Protected user routes
router.use(protect);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/profile-picture', upload.single('photo'), uploadProfilePicture);
router.get('/languages', getLanguages);
router.patch('/languages', updateLanguages);
router.patch('/deactivate', deactivateAccount);
router.post('/feedback', submitFeedback);
router.get('/call-history', getUserCallHistory);

export default router;
