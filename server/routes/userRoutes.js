import express from 'express';
import {
  getUsers,
  getUserById,
  searchUsers,
  updateProfile
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getUsers);
router.get('/search', optionalAuth, searchUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', optionalAuth, getUserById);

export default router;
