import { Product } from './product.model';
import { assertOwnership } from '../../utils/ownershipCheck';

export const listProducts = async (userId: string, search?: string, type?: string) => {
  const query: any = { userId };

  if (type) {
    query.type = type;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { hsnSac: { $regex: search, $options: 'i' } },
    ];
  }

  return await Product.find(query).sort({ createdAt: -1 }).lean();
};

export const createProduct = async (userId: string, data: any) => {
  // Only check SKU uniqueness if an SKU was provided
  if (data.sku) {
    const existingProduct = await Product.findOne({ userId, sku: data.sku });
    if (existingProduct) {
      throw Object.assign(new Error('A product with this SKU already exists'), {
        statusCode: 400,
        code: 'PRODUCT_EXISTS',
      });
    }
  }

  const product = new Product({
    ...data,
    userId,
  });

  await product.save();
  return product;
};

export const getProduct = async (userId: string, productId: string) => {
  return await assertOwnership(Product, productId, userId);
};

export const updateProduct = async (userId: string, productId: string, data: any) => {
  const product = await assertOwnership(Product, productId, userId);

  if (data.sku && data.sku !== product.sku) {
    const existingProduct = await Product.findOne({ userId, sku: data.sku });
    if (existingProduct) {
      throw Object.assign(new Error('A product with this SKU already exists'), {
        statusCode: 400,
        code: 'PRODUCT_EXISTS',
      });
    }
  }

  Object.assign(product, data);
  await product.save();
  return product;
};

export const adjustStock = async (userId: string, productId: string, data: { adjustment?: number; stock?: number }) => {
  const product = await assertOwnership(Product, productId, userId);

  if (data.stock !== undefined) {
    product.stock = Math.max(0, data.stock);
  } else if (data.adjustment !== undefined) {
    product.stock = Math.max(0, product.stock + data.adjustment);
  }

  await product.save();
  return product;
};

export const deleteProduct = async (userId: string, productId: string) => {
  const product = await assertOwnership(Product, productId, userId);
  await product.deleteOne();
};
