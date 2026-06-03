import axios from 'axios';

const getGithubActivity = async (username) => {
  if (!username) return { commits: 0, prs: 0 };

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`, {
      headers,
      timeout: 30000,
    });

    const events = Array.isArray(response.data) ? response.data : [];
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let commits = 0;
    let prs = 0;

    events.forEach((event) => {
      const createdAt = new Date(event.created_at).getTime();
      if (createdAt < since) return;

      if (event.type === 'PushEvent') {
        commits += event.payload?.commits?.length || 0;
      }

      if (event.type === 'PullRequestEvent') {
        prs += 1;
      }
    });

    return { commits, prs };
  } catch (error) {
    console.error('GitHub activity fetch failed:', error.response?.status || error.code, error.message);
    return { commits: 0, prs: 0 };
  }
};

export default { getGithubActivity };
