import express from 'express';
import { submitReview, getUserReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitReview);
router.get('/:userId', getUserReviews);

export default router;
