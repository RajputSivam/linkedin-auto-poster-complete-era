import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from './config/db.js';
import User from './models/User.js';
import githubService from './services/githubService.js';
import leetcodeService from './services/leetcodeService.js';
import aiService from './services/aiService.js';

dotenv.config();

const main = async () => {
    try {
        await connectDB();
        const user = await User.findOne({}).sort({ createdAt: -1 });

        if (!user) {
            console.log('USER_CHECK', JSON.stringify({ status: 'FAIL', reason: 'No user found in DB' }));
            process.exit(1);
        }

        const githubUsername = user.githubUsername || 'octocat';
        const leetcodeUsername = user.leetcodeUsername || 'sivam';

        console.log('USER_CHECK', JSON.stringify({
            status: 'OK',
            githubUsername,
            leetcodeUsername,
            hasAccessToken: Boolean(user.accessToken),
            accessTokenPreview: user.accessToken ? `${user.accessToken.slice(0, 12)}...` : null,
            linkedinId: user.linkedinId || null,
            name: user.name || null,
        }));

        const githubResult = await githubService.getGithubActivity(githubUsername);
        console.log('GITHUB_RESULT', JSON.stringify(githubResult));

        const leetcodeResult = await leetcodeService.getLeetcodeActivity(leetcodeUsername);
        console.log('LEETCODE_RESULT', JSON.stringify(leetcodeResult));

        let linkedinStatus = 'FAIL';
        let linkedinInfo = null;
        if (!user.accessToken) {
            linkedinInfo = { error: 'Missing LinkedIn access token in DB' };
        } else {
            try {
                const resp = await axios.get('https://api.linkedin.com/v2/userinfo', {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                    timeout: 30000,
                });
                linkedinStatus = 'PASS';
                linkedinInfo = resp.data;
            } catch (e) {
                linkedinInfo = { error: e.response?.status || e.code, message: e.message };
            }
        }
        console.log('LINKEDIN_TOKEN_CHECK', JSON.stringify({ status: linkedinStatus, info: linkedinInfo }));

        const post = await aiService.generatePost({ github: githubResult, leetcode: leetcodeResult });
        console.log('AI_POST_SAMPLE', JSON.stringify(post));
    } catch (err) {
        console.error('MAIN_ERROR', JSON.stringify({ status: 'FAIL', error: err.message }));
        process.exitCode = 1;
    }
};

main();
