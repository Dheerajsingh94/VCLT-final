import express from 'express';
import { getAgoraConfig, joinRoom, getRoomInfo } from '../controllers/roomController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/config', getAgoraConfig);
router.post('/join', protect, joinRoom);
router.get('/info/:roomName', protect, getRoomInfo);

export default router;
