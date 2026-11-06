import express from 'express';
import {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  getCompletedExchanges,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All request actions require authentication

router.post('/', createRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.get('/completed', getCompletedExchanges);

router.patch('/:id/accept', acceptRequest);
router.patch('/:id/reject', rejectRequest);
router.patch('/:id/cancel', cancelRequest);
router.patch('/:id/complete', completeRequest);

export default router;
