import axios from 'axios';

const getLeetcodeActivity = async (username) => {
  if (!username) return { solved: 0, languages: [] };

  try {
    const query = `query recentSubmissionList($username: String!) {
      recentSubmissionList(username: $username) {
        timestamp
        title
        lang
        statusDisplay
      }
    }`;

    const response = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username } },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 30000,
      }
    );

    const submissions = response.data?.data?.recentSubmissionList || [];
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let solved = 0;
    const languages = new Set();

    submissions.forEach((submission) => {
      const date = new Date((submission.timestamp || 0) * 1000).getTime();
      if (date < since) return;
      if (submission.statusDisplay === 'Accepted') {
        solved += 1;
        if (submission.lang) languages.add(submission.lang);
      }
    });

    return { solved, languages: Array.from(languages) };
  } catch (error) {
    console.error('LeetCode activity fetch failed:', error.response?.status || error.code, error.message);
    return { solved: 0, languages: [] };
  }
};

export default { getLeetcodeActivity };
