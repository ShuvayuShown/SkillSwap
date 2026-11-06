import express from 'express';
import {
  getDashboardStats,
  getRecommendations
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recommendations', getRecommendations);

export default router;
