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

    if (quest.completed) {
      res.status(400).json({ error: 'Quest already completed' });
      return;
    }

    const [updatedQuest, xpResult] = await Promise.all([
      prisma.quest.update({
        where: { id },
        data: { completed: true, completedAt: new Date() },
      }),
      awardXP(req.userId!, quest.xpReward, `Quest: ${quest.title}`),
    ]);

    res.json({ quest: updatedQuest, xp: xpResult });
  } catch (err) {
    console.error('[PATCH /quests/:id/complete]', err);
    res.status(500).json({ error: 'Failed to complete quest' });
  }
});

// POST /api/quests/seed - Seed daily quests (called on login / daily reset)
router.post('/seed', async (req: AuthRequest, res: Response): Promise<void> => {
  const defaultQuests = [
    { title: 'Practice React for 30 mins', description: 'Build a small component or review hooks', xpReward: 50, difficulty: 'EASY' as const },
    { title: 'Solve 1 Coding Challenge', description: 'Complete a LeetCode or similar problem', xpReward: 75, difficulty: 'MEDIUM' as const },
    { title: 'Watch an AI/ML Tutorial', description: 'Learn a new concept in AI or machine learning', xpReward: 60, difficulty: 'EASY' as const },
    { title: 'Read a Technical Article', description: 'Read and summarize a blog post or paper', xpReward: 40, difficulty: 'EASY' as const },
    { title: 'Build a Mini Project', description: 'Create something small from scratch', xpReward: 100, difficulty: 'HARD' as const },
  ];

  try {
    // Check if quests were already seeded today
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
    res.status(500).json({ error: 'Failed to seed quests' });
  }
});

export default router;
