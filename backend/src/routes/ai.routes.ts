import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { generateMentorFeedback } from '../services/ai.service';
import { prisma } from '../lib/prisma';

const router = Router();
router.use(authMiddleware);

// POST /api/ai/mentor - Generate AI mentor feedback
router.post('/mentor', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const feedback = await generateMentorFeedback(req.userId!);
    res.json({ feedback });
  } catch (err: any) {
    console.error('[POST /ai/mentor]', err);
    if (err?.code === 'insufficient_quota') {
      res.status(429).json({ error: 'OpenAI quota exceeded. Please check your API key.' });
    } else {
      res.status(500).json({ error: 'Failed to generate AI feedback' });
    }
  }
});

// GET /api/ai/insights - Get past AI insights
router.get('/insights', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const insights = await prisma.aIInsight.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

export default router;
