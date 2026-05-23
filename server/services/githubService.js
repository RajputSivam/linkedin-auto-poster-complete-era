import axios from 'axios';

const getGithubActivity = async (username) => {
  if (!username) return { commits: 0, prs: 0 };

  const response = await axios.get(`https://api.github.com/users/${username}/events`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const events = response.data || [];
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let commits = 0;
  let prs = 0;

  events.forEach((event) => {
    const createdAt = new Date(event.created_at).getTime();
    if (createdAt < since) return;

    if (event.type === 'PushEvent') {
      commits += event.payload.commits?.length || 0;
    }

    if (event.type === 'PullRequestEvent') {
      prs += 1;
    }
  });

  return { commits, prs };
};

export default { getGithubActivity };
