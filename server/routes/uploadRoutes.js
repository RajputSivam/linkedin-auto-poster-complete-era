import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware.single('file'), uploadFile);

export default router;
