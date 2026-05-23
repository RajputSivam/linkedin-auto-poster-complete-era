import express from 'express';
import { getActivity } from '../controllers/activityController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getActivity);

export default router;
