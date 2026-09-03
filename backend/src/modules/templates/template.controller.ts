import { Request, Response, NextFunction } from 'express';
import * as templateService from './template.service';

export const listTemplates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templates = await templateService.listTemplates();
    res.status(200).json({ success: true, data: { templates } });
  } catch (error) {
    next(error);
  }
};
