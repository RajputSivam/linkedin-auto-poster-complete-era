import express from 'express';
import {
  generatePost,
  getHistory,
  approvePost,
  skipPost,
  getPendingPosts,
} from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generatePost);
router.get('/history', authMiddleware, getHistory);
router.get('/pending', authMiddleware, getPendingPosts);
router.post('/approve/:id', authMiddleware, approvePost);
router.post('/skip/:id', authMiddleware, skipPost);

export default router;
