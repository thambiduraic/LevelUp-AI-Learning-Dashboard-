import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  userId?: string;
  supabaseUser?: {
    id: string;
    email?: string;
  };
}

/**
 * Middleware to validate Supabase JWT tokens and attach userId to request.
 * Tokens are sent as Bearer tokens in the Authorization header.
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token with Supabase Admin
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error('[Auth Middleware] Invalid token error:', error?.message || 'No user found');
      res.status(401).json({ 
        error: 'Unauthorized: Invalid token',
        message: error?.message 
      });
      return;
    }


    // Find the user in our DB via their supabaseId
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    // Auto-sync: If user exists in Supabase but not in our Prisma DB, create them immediately
    if (!dbUser) {
      console.log(`[Auto-Sync Middleware] Creating profile for: ${user.email}`);
      dbUser = await prisma.user.create({
        data: {
          supabaseId: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Learner',
          email: user.email || '',
          image: user.user_metadata?.avatar_url || null,
        },
      });
    }

    req.userId = dbUser.id;
    req.supabaseUser = { id: user.id, email: user.email };
    next();


  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
