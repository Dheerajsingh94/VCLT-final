import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getReactivationRequests,
  resolveReactivationRequest,
  getAllFeedbacks,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/requests', getReactivationRequests);
router.patch('/requests/:id/resolve', resolveReactivationRequest);
router.get('/feedbacks', getAllFeedbacks);

export default router;
