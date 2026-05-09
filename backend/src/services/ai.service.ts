import OpenAI from 'openai';
import { prisma } from '../lib/prisma';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UserContext {
  name: string;
  level: number;
  totalXP: number;
  streak: number;
  recentQuests: Array<{ title: string; completed: boolean }>;
  skills: Array<{ name: string; category: string; progress: number }>;
}

/**
 * Generate personalized AI mentor feedback for a user.
 */
export const generateMentorFeedback = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      quests: { orderBy: { createdAt: 'desc' }, take: 10 },
      skills: { take: 10 },
    },
  });

  if (!user) throw new Error('User not found');

  const context: UserContext = {
    name: user.name,
    level: user.level,
    totalXP: user.totalXP,
    streak: user.streak,
    recentQuests: user.quests.map((q) => ({ title: q.title, completed: q.completed })),
    skills: user.skills.map((s) => ({ name: s.name, category: s.category, progress: s.progress })),
  };

  const prompt = `You are an expert AI learning mentor for a gamified learning platform. 
Analyze this student's data and provide personalized, motivational feedback.

Student Profile:
- Name: ${context.name}
- Level: ${context.level}
- Total XP: ${context.totalXP}
- Current Streak: ${context.streak} days
- Recent Quests: ${JSON.stringify(context.recentQuests)}
- Skills: ${JSON.stringify(context.skills)}

Provide 3-4 concise, personalized insights that:
1. Acknowledge their recent progress
2. Identify areas for improvement
3. Give specific action recommendations
4. Include motivational encouragement

Keep it friendly, specific, and actionable. Format as bullet points. Maximum 200 words.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.7,
  });

  const feedback = response.choices[0]?.message?.content || 'Keep up the great work! Stay consistent with your daily quests.';

  // Persist the insight
  await prisma.aIInsight.create({
    data: { userId, feedback },
  });

  return feedback;
};
