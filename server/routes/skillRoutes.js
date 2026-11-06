import express from 'express';
import {
  getSkillsMeta,
  addTeachingSkill,
  updateTeachingSkill,
  deleteTeachingSkill,
  addLearningSkill,
  updateLearningSkill,
  deleteLearningSkill
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSkillsMeta);

// Teaching skills
router.post('/teach', protect, addTeachingSkill);
router.put('/teach/:id', protect, updateTeachingSkill);
router.delete('/teach/:id', protect, deleteTeachingSkill);

// Learning skills
router.post('/learn', protect, addLearningSkill);
router.put('/learn/:id', protect, updateLearningSkill);
router.delete('/learn/:id', protect, deleteLearningSkill);

export default router;
