import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, linkedinId: user.linkedinId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const linkedinAuth = (req, res) => {
  res.send('Authenticate with LinkedIn');
};

export const linkedinCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=login_failed`);
  }

  const token = generateToken(req.user);
  const redirectUrl = `${process.env.CLIENT_URL}/dashboard?token=${token}`;
  res.redirect(redirectUrl);
};

export const getMe = async (req, res) => {
  try {
    const user = req.user || null;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const safeUser = {
      _id: user._id,
      linkedinId: user.linkedinId,
      name: user.name,
      email: user.email,
      postingMode: user.postingMode,
      githubUsername: user.githubUsername,
      leetcodeUsername: user.leetcodeUsername,
    };

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out' });
  });
};

export const updateSettings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const {
      githubUsername,
      leetcodeUsername,
      postingMode,
    } = req.body;

    user.githubUsername = githubUsername ?? user.githubUsername;
    user.leetcodeUsername = leetcodeUsername ?? user.leetcodeUsername;
    user.postingMode = postingMode ?? user.postingMode;

    await user.save();

    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
