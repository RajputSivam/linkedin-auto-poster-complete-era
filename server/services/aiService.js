import dotenv from 'dotenv';
dotenv.config();

const safeGenerateFromActivity = (activityData) => {
  const lines = [];
  lines.push(`Had a productive week of coding! 👩\u200d💻👨\u200d💻`);

  if (activityData?.github) {
    lines.push(`• GitHub: ${activityData.github.commits || 0} commits, ${activityData.github.prs || 0} PRs`);
  }
  if (activityData?.leetcode) {
    const solved = activityData.leetcode.solved || 0;
    const submissions = activityData.leetcode.submissionsThisWeek || 0;
    lines.push(`• LeetCode: ${solved} solved, ${submissions} submissions this week (${(activityData.leetcode.languages || []).join(', ')})`);
  }
  if (activityData?.codeforces) {
    lines.push(`• Codeforces: rating ${activityData.codeforces.rating ?? 'N/A'}, solved ${activityData.codeforces.problemsSolved || 0}`);
  }
  if (activityData?.codechef) {
    lines.push(`• CodeChef: rating ${activityData.codechef.rating ?? 'N/A'}, stars ${activityData.codechef.stars ?? 'N/A'}`);
  }

  lines.push('\nCelebrating continuous learning and small wins! #100DaysOfCode #coding');
  return lines.join('\n');
};

const generatePost = async (activityData) => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate a professional, engaging LinkedIn post based on this week's coding activity. Include emojis, bullet points, and relevant hashtags. Activity data: ${JSON.stringify(activityData)}`;
      const generation = await model.generateContent(prompt);
      const content = generation?.response?.text?.() || safeGenerateFromActivity(activityData);

      const evaluationPrompt = `Read the following LinkedIn post and provide a short evaluation message plus a score from 1 to 10:\n\nPost:\n${content}`;
      const evaluation = await model.generateContent(evaluationPrompt);
      const evaluationText = evaluation?.response?.text?.() || 'Good job! Score: 8';
      const feedbackScoreMatch = evaluationText.match(/(\d{1,2})/);
      const feedbackScore = feedbackScoreMatch ? Number(feedbackScoreMatch[1]) : 8;

      return { content, feedbackMessage: evaluationText, feedbackScore };
    } catch (err) {
      const content = safeGenerateFromActivity(activityData);
      return { content, feedbackMessage: 'Fallback evaluation: looks good', feedbackScore: 8 };
    }
  }

  // No API key — return deterministic fallback content.
  const content = safeGenerateFromActivity(activityData);
  return { content, feedbackMessage: 'Fallback evaluation: looks good', feedbackScore: 8 };
};

export default { generatePost };
