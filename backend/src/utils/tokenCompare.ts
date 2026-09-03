import crypto from 'crypto';

/**
 * Safely compares two strings using a constant-time algorithm to prevent timing attacks.
 * Both strings must be converted to buffers of the same length before comparison.
 */
export const safeCompare = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  
  if (bufferA.length !== bufferB.length) {
    // Return false immediately but still do a dummy comparison to reduce timing clues somewhat
    crypto.timingSafeEqual(bufferA, bufferA);
    return false;
  }
  
  return crypto.timingSafeEqual(bufferA, bufferB);
};
