import axios from 'axios';

const getCodeforcesActivity = async (handle) => {
  if (!handle) return { rating: null, contestsThisWeek: 0, problemsSolved: 0 };

  const [ratingResponse, statusResponse] = await Promise.all([
    axios.get(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
    axios.get(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`),
  ]);

  const ratingData = ratingResponse.data?.result || [];
  const statusData = statusResponse.data?.result || [];
  const rating = ratingData.length ? ratingData[ratingData.length - 1].newRating : null;

  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let problemsSolved = 0;
  const contestIds = new Set();

  statusData.forEach((submission) => {
    const createdAt = submission.creationTimeSeconds * 1000;
    if (createdAt < since) return;
    if (submission.verdict === 'OK') {
      problemsSolved += 1;
      if (submission.contestId) contestIds.add(submission.contestId);
    }
  });

  return {
    rating,
    contestsThisWeek: contestIds.size,
    problemsSolved,
  };
};

export default { getCodeforcesActivity };
