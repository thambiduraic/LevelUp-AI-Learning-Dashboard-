import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { awardXP } from '../services/xp.service';

const router = Router();
router.use(authMiddleware);

// GET /api/quests - Get all quests for the user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quests = await prisma.quest.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

// POST /api/quests - Create a new quest
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, xpReward, difficulty } = req.body;

  if (!title || !xpReward) {
    res.status(400).json({ error: 'Title and XP reward are required' });
    return;
  }

  try {
    const quest = await prisma.quest.create({
      data: {
        title,
        description: description || '',
        xpReward: parseInt(xpReward),
        difficulty: difficulty || 'MEDIUM',
        userId: req.userId!,
      },
    });
    res.status(201).json(quest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quest' });
  }
});

// PATCH /api/quests/:id/start - Start a quest
router.patch('/:id/start', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const quest = await prisma.quest.findFirst({
      where: { id, userId: req.userId },
    });

    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    if (quest.status !== 'AVAILABLE') {
      res.status(400).json({ error: `Quest cannot be started from status: ${quest.status}` });
      return;
    }

    const updated = await prisma.quest.update({
      where: { id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start quest' });
  }
});

// PATCH /api/quests/:id/complete - Mark a quest as complete
router.patch('/:id/complete', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const quest = await prisma.quest.findFirst({
      where: { id, userId: req.userId },
    });

    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    if (quest.status === 'COMPLETED') {
      res.status(400).json({ error: 'Quest already completed' });
      return;
    }

    if (quest.status !== 'IN_PROGRESS') {
      res.status(400).json({ error: 'Quest must be started before it can be completed' });
      return;
    }

    const [updatedQuest, xpResult] = await Promise.all([
      prisma.quest.update({
        where: { id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      }),
      awardXP(req.userId!, quest.xpReward, `Quest: ${quest.title}`),
    ]);

    res.json({ quest: updatedQuest, xp: xpResult });
  } catch (err) {
    console.error('[PATCH /quests/:id/complete]', err);
    res.status(500).json({ error: 'Failed to complete quest' });
  }
});

// POST /api/quests/seed - Seed daily quests
router.post('/seed', async (req: AuthRequest, res: Response): Promise<void> => {
  const defaultQuests = [
    { 
      title: 'Practice React for 30 mins', 
      description: 'Build a small component or review hooks', 
      xpReward: 50, 
      difficulty: 'EASY' as const,
      category: 'Frontend',
      duration: 30,
      instructions: 'Open your code editor and build a simple React component using useState and useEffect. Focus on state management and lifecycle methods.',
      objective: 'Understand React hooks and component structure.',
      resources: [
        { title: 'React Hooks Docs', url: 'https://react.dev/reference/react' },
        { title: 'Beta React Docs', url: 'https://react.dev' }
      ]
    },
    { 
      title: 'Solve 1 Coding Challenge', 
      description: 'Complete a LeetCode or similar problem', 
      xpReward: 75, 
      difficulty: 'MEDIUM' as const,
      category: 'Problem Solving',
      duration: 45,
      instructions: 'Navigate to LeetCode or HackerRank and solve a problem of medium difficulty. Focus on time complexity and edge cases.',
      objective: 'Improve algorithmic thinking and problem-solving skills.',
      resources: [
        { title: 'LeetCode', url: 'https://leetcode.com' },
        { title: 'HackerRank', url: 'https://hackerrank.com' }
      ]
    },
    { 
      title: 'Watch an AI/ML Tutorial', 
      description: 'Learn a new concept in AI or machine learning', 
      xpReward: 60, 
      difficulty: 'EASY' as const,
      category: 'AI/ML',
      duration: 20,
      instructions: 'Watch a short video or read an introductory article about Neural Networks or Linear Regression.',
      objective: 'Familiarize yourself with basic AI concepts.',
      resources: [
        { title: 'Andrew Ng Machine Learning', url: 'https://www.coursera.org/learn/machine-learning' }
      ]
    },
    { 
      title: 'Read a Technical Article', 
      description: 'Read and summarize a blog post or paper', 
      xpReward: 40, 
      difficulty: 'EASY' as const,
      category: 'General',
      duration: 15,
      instructions: 'Find a technical article on Medium, Dev.to, or a company engineering blog. Write down three key takeaways.',
      objective: 'Stay updated with industry trends and technologies.',
      resources: [
        { title: 'Dev.to', url: 'https://dev.to' }
      ]
    },
    { 
      title: 'Build a Mini Project', 
      description: 'Create something small from scratch', 
      xpReward: 100, 
      difficulty: 'HARD' as const,
      category: 'Fullstack',
      duration: 120,
      instructions: 'Choose a small idea (e.g., weather app, simple API) and build it from scratch including both frontend and backend elements.',
      objective: 'Apply full-stack development skills in a practical scenario.',
      resources: [
        { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' }
      ]
    },
  ];

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingQuests = await prisma.quest.count({
      where: { userId: req.userId!, createdAt: { gte: today } },
    });

    if (existingQuests > 0) {
      const quests = await prisma.quest.findMany({ where: { userId: req.userId! } });
      res.json({ quests, seeded: false });
      return;
    }

    await prisma.quest.createMany({
      data: defaultQuests.map((q) => ({ ...q, userId: req.userId! })),
    });

    const quests = await prisma.quest.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ quests, seeded: true });
  } catch (err) {
    console.error('[POST /quests/seed]', err);
    res.status(500).json({ error: 'Failed to seed quests' });
  }
});

export default router;
