import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';
import { User } from '../modules/users/user.model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
      return;
    }

    const payload = verifyAccess(token);
    
    // Check if user still exists
    const user = await User.findById(payload.userId).select('_id email plan');
    if (!user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User no longer exists' } });
      return;
    }

    (req as any).user = {
      _id: user._id.toString(),
      email: user.email,
      plan: user.plan as 'free' | 'paid',
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Access token expired' } });
      return;
    }
    res.status(401).json({ success: false, error: { code: 'TOKEN_INVALID', message: 'Invalid access token' } });
  }
};
