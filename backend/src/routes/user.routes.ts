import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { getXPForNextLevel } from '../services/xp.service';

const router = Router();
router.use(authMiddleware);

// GET /api/users/profile - Get current user profile
router.get('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        _count: { select: { quests: true, skills: true, xpHistory: true } },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const xpProgress = getXPForNextLevel(user.totalXP);
    res.json({ ...user, xpProgress });
  } catch (err) {
    console.error('[GET /users/profile]', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});



// POST /api/users/profile - Create/upsert user profile after Supabase auth
router.post('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, image } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  try {
    const user = await prisma.user.upsert({
      where: { supabaseId: req.supabaseUser!.id },
      update: { name, image },
      create: {
        supabaseId: req.supabaseUser!.id,
        name,
        email,
        image,
      },
    });

    res.json(user);
  } catch (err) {
    console.error('[POST /users/profile]', err);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
});

// PATCH /api/users/settings - Update user settings
router.patch('/settings', async (req: AuthRequest, res: Response): Promise<void> => {
  const { settings } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      // @ts-ignore - Temporary until prisma generate is run without EPERM
      data: { settings },
    });

    res.json(user);
  } catch (err) {
    console.error('[PATCH /users/settings]', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// PATCH /api/users/profile - Update user profile (name, image)
router.patch('/profile', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, image } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, image },
    });
    res.json(user);
  } catch (err) {
    console.error('[PATCH /users/profile]', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


export default router;
