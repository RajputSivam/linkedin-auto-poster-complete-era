import githubService from '../services/githubService.js';
import leetcodeService from '../services/leetcodeService.js';
import codeforcesService from '../services/codeforcesService.js';
import codechefService from '../services/codechefService.js';

export const getActivity = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const [github, leetcode, codeforces, codechef] = await Promise.all([
      githubService.getGithubActivity(user.githubUsername),
      leetcodeService.getLeetcodeActivity(user.leetcodeUsername),
      codeforcesService.getCodeforcesActivity(user.codeforcesHandle),
      codechefService.getCodechefActivity(user.codechefUsername),
    ]);

    res.json({ github, leetcode, codeforces, codechef });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
