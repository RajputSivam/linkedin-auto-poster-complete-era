import githubService from '../services/githubService.js';
import leetcodeService from '../services/leetcodeService.js';
import codeforcesService from '../services/codeforcesService.js';
import codechefService from '../services/codechefService.js';

export const getActivity = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const [githubResult, leetcodeResult, codeforcesResult, codechefResult] = await Promise.allSettled([
      githubService.getGithubActivity(user.githubUsername),
      leetcodeService.getLeetcodeActivity(user.leetcodeUsername),
      codeforcesService.getCodeforcesActivity(user.codeforcesHandle),
      codechefService.getCodechefActivity(user.codechefUsername),
    ]);

    const github = githubResult.status === 'fulfilled' ? githubResult.value : { commits: 0, prs: 0 };
    const leetcode = leetcodeResult.status === 'fulfilled' ? leetcodeResult.value : { solved: 0, languages: [] };
    const codeforces = codeforcesResult.status === 'fulfilled' ? codeforcesResult.value : { rating: null, contestsThisWeek: 0, problemsSolved: 0 };
    const codechef = codechefResult.status === 'fulfilled' ? codechefResult.value : { rating: null, stars: null };

    res.json({ github, leetcode, codeforces, codechef });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
