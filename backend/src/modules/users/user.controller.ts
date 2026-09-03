import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getMe((req as any).user._id);
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateMe((req as any).user._id, req.body);
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const exportData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await userService.exportData((req as any).user._id);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="inkviz-export.json"');
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userService.deleteMe((req as any).user._id, req.body.confirmText);
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, data: { message: 'Account deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
