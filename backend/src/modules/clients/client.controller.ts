import { Request, Response, NextFunction } from 'express';
import * as clientService from './client.service';

export const listClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;
    const clients = await clientService.listClients((req as any).user._id, search as string);
    res.status(200).json({ success: true, data: { clients } });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await clientService.createClient((req as any).user._id, req.body);
    res.status(201).json({ success: true, data: { client } });
  } catch (error) {
    next(error);
  }
};

export const getClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await clientService.getClient((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { client } });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await clientService.updateClient((req as any).user._id, req.params.id as string, req.body);
    res.status(200).json({ success: true, data: { client } });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await clientService.deleteClient((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { message: 'Client deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
