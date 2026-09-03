import mongoose, { Model, Document } from 'mongoose';

/**
 * Custom error for missing or unauthorized resources.
 * Always throws a 404 to prevent resource enumeration (never 403), as per Blueprint Section 4.
 */
export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Asserts that a resource exists and belongs to the specified user.
 * 
 * @param model - Mongoose Model
 * @param resourceId - ID of the resource
 * @param userId - ID of the requesting user
 * @returns The found document
 * @throws NotFoundError if the document doesn't exist or doesn't belong to the user
 */
export const assertOwnership = async <T>(
  model: Model<T>,
  resourceId: string,
  userId: string,
): Promise<Document<unknown, {}, T> & T> => {
  if (!mongoose.isValidObjectId(resourceId) || !mongoose.isValidObjectId(userId)) {
    throw new NotFoundError();
  }
  const doc = await model.findOne({ _id: resourceId, userId });
  if (!doc) {
    throw new NotFoundError();
  }
  return doc as any;
};
