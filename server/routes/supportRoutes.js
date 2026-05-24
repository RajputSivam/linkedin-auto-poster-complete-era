import express from 'express';
import { postSupportChat } from '../controllers/supportController.js';

const router = express.Router();

router.post('/chat', postSupportChat);

export default router;
