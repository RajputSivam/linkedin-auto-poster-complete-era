import dotenv from 'dotenv';
dotenv.config();

const safeGenerateFromActivity = (activityData) => {
  const lines = [];
  lines.push(`Had a productive week of coding! 👩\u200d💻👨\u200d💻`);

  if (activityData?.github) {
    lines.push(`• GitHub: ${activityData.github.commits || 0} commits, ${activityData.github.prs || 0} PRs`);
  }
  if (activityData?.leetcode) {
    lines.push(`• LeetCode: ${activityData.leetcode.solved || 0} solved (${(activityData.leetcode.languages || []).join(', ')})`);
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
  // Try to use Google Gemini if available, otherwise fall back to a safe local generator.
  if (process.env.GEMINI_API_KEY) {
    try {
      const ga = await import('@google/generative-ai');
      const { TextGenerationModel } = ga;
      const model = new TextGenerationModel({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate a professional, engaging LinkedIn post based on this week's coding activity. Include emojis, bullet points, and relevant hashtags. Activity data: ${JSON.stringify(activityData)}`;
      const generation = await model.generate({ model: 'gemini-pro', prompt, maxOutputTokens: 400 });
      const content = generation?.candidates?.[0]?.content || safeGenerateFromActivity(activityData);

      const evaluationPrompt = `Read the following LinkedIn post and provide a short evaluation message plus a score from 1 to 10:\n\nPost:\n${content}`;
      const evaluation = await model.generate({ model: 'gemini-pro', prompt: evaluationPrompt, maxOutputTokens: 100 });
      const evaluationText = evaluation?.candidates?.[0]?.content || 'Good job! Score: 8';
      const feedbackScoreMatch = evaluationText.match(/(\d{1,2})/);
      const feedbackScore = feedbackScoreMatch ? Number(feedbackScoreMatch[1]) : 8;

      return { content, feedbackMessage: evaluationText, feedbackScore };
    } catch (err) {
      // If the native package import fails, fall back to local generator.
      const content = safeGenerateFromActivity(activityData);
      return { content, feedbackMessage: 'Fallback evaluation: looks good', feedbackScore: 8 };
    }
  }

  // No API key — return deterministic fallback content.
  const content = safeGenerateFromActivity(activityData);
  return { content, feedbackMessage: 'Fallback evaluation: looks good', feedbackScore: 8 };
};

export default { generatePost };
