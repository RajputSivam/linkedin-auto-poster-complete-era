import Post from '../models/Post.js';
import linkedinService from '../services/linkedinService.js';
import aiService from '../services/aiService.js';

export const generatePost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const activityData = req.body.activityData;
    const { content, feedbackMessage, feedbackScore } = await aiService.generatePost(activityData);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const post = await Post.create({
      userId: user._id,
      content,
      feedbackMessage,
      feedbackScore,
      weekStart,
      status: 'pending',
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingPosts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const posts = await Post.find({ userId: user._id, status: 'pending' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approvePost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const post = await Post.findOne({ _id: id, userId: user._id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await linkedinService.publishPost(user.accessToken, post.content, post.mediaUrl, user.linkedinId);
    post.status = 'published';
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const skipPost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const post = await Post.findOne({ _id: id, userId: user._id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.status = 'skipped';
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
