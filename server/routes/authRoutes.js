import express from 'express';
import passport from 'passport';
import { getMe, logout, linkedinCallback, updateSettings } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/linkedin', passport.authenticate('openidconnect'));
router.get('/linkedin/callback', passport.authenticate('openidconnect', { failureRedirect: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : '/login' }), linkedinCallback);
router.get('/me', authMiddleware, getMe);
router.put('/settings', authMiddleware, updateSettings);
router.get('/logout', logout);

export default router;
