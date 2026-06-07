import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import weeklyJob from './jobs/weeklyJob.js';
import keepAliveJob from './jobs/keepAliveJob.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/activity', activityRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/trigger-weekly-job', async (req, res) => {
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const users = await User.find({});
    await Promise.all(
      users.map(async (user) => {
        try {
          const [github, leetcode, codeforces, codechef] = await Promise.all([
            githubService.getGithubActivity(user.githubUsername),
            leetcodeService.getLeetcodeActivity(user.leetcodeUsername),
            codeforcesService.getCodeforcesActivity(user.codeforcesHandle),
            codechefService.getCodechefActivity(user.codechefUsername),
          ]);
          if (user.accessTokenExpiresAt && new Date(user.accessTokenExpiresAt) <= new Date()) {
            return;
          }
          const activityData = { github, leetcode, codeforces, codechef };
          const { content, feedbackMessage, feedbackScore } = await aiService.generatePost(activityData);
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const post = await Post.create({
            userId: user._id, content, feedbackMessage, feedbackScore, weekStart,
            status: user.postingMode === 'auto-post' ? 'published' : 'pending',
          });
          if (user.postingMode === 'auto-post') {
            await linkedinService.publishPost(user.accessToken, content, post.mediaUrl, user.linkedinId);
          }
        } catch (err) {
          console.error('Failed to process user:', err.message);
        }
      })
    );
    res.json({ success: true, message: 'Weekly job triggered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'LinkedIn Auto-Poster API is running' });
});

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await connectDB();
    weeklyJob();
    keepAliveJob();
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
