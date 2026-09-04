import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service';

export const listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, type } = req.query;
    const products = await productService.listProducts(
      (req as any).user._id,
      search as string,
      type as string
    );
    res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.createProduct((req as any).user._id, req.body);
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.getProduct((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.updateProduct(
      (req as any).user._id,
      req.params.id as string,
      req.body
    );
    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.adjustStock(
      (req as any).user._id,
      req.params.id as string,
      req.body
    );
    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await productService.deleteProduct((req as any).user._id, req.params.id as string);
    res.status(200).json({ success: true, data: { message: 'Product deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
