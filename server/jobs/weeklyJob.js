import cron from 'node-cron';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import githubService from '../services/githubService.js';
import leetcodeService from '../services/leetcodeService.js';
import codeforcesService from '../services/codeforcesService.js';
import codechefService from '../services/codechefService.js';
import aiService from '../services/aiService.js';
import linkedinService from '../services/linkedinService.js';

dotenv.config();

const weeklyJob = () => {
  cron.schedule(
    '0 21 * * 0',
    async () => {
      console.log('Running weekly job for LinkedIn Auto-Poster');
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

              const activityData = { github, leetcode, codeforces, codechef };
              const { content, feedbackMessage, feedbackScore } = await aiService.generatePost(activityData);

              const weekStart = new Date();
              weekStart.setDate(weekStart.getDate() - weekStart.getDay());

              const post = await Post.create({
                userId: user._id,
                content,
                feedbackMessage,
                feedbackScore,
                weekStart,
                status: user.postingMode === 'auto-post' ? 'published' : 'pending',
              });

              if (user.postingMode === 'auto-post') {
                await linkedinService.publishPost(user.accessToken, content, post.mediaUrl, user.linkedinId);
              }
            } catch (error) {
              console.error('Failed to process user in weekly job:', error.message);
            }
          })
        );
      } catch (error) {
        console.error('Weekly job failed:', error.message);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );
};

export default weeklyJob;
