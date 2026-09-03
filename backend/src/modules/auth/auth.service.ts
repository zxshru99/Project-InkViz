import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../users/user.model';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../services/email.service';
import { signAccess, signRefresh } from '../../utils/jwt';
import { safeCompare } from '../../utils/tokenCompare';

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const register = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw Object.assign(new Error('Email already registered'), { statusCode: 409, code: 'CONFLICT' });
  }

  const passwordHash = await hashPassword(data.password);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(emailVerificationToken).digest('hex');

  const user = new User({
    name: data.name,
    email: data.email,
    passwordHash,
    emailVerificationToken: tokenHash,
  });

  await user.save();

  // Send email asynchronously
  sendVerificationEmail(user.email, emailVerificationToken).catch(console.error);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
};

export const login = async (data: any) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  // Check lockout
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw Object.assign(new Error('Account locked due to multiple failed attempts'), { statusCode: 403, code: 'FORBIDDEN' });
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);

  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
    }
    await user.save();
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  // Reset lockout
  user.loginAttempts = 0;
  user.lockUntil = undefined as any;

  const accessToken = signAccess({ userId: user._id.toString() });
  const refreshToken = signRefresh({ userId: user._id.toString() });

  // Store refresh token hash (only one active session for MVP)
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  return { accessToken, refreshToken, user: { _id: user._id, name: user.name, email: user.email, plan: user.plan } };
};

export const refresh = async (refreshToken: string) => {
  let userId: string;
  try {
    const payload = require('../../utils/jwt').verifyRefresh(refreshToken);
    userId = payload.userId;
  } catch (error: any) {
    throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  const user = await User.findById(userId);
  if (!user || !user.refreshTokenHash) {
    throw Object.assign(new Error('Session expired'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  
  // Use safeCompare to prevent timing attacks
  if (!safeCompare(tokenHash, user.refreshTokenHash)) {
    // Potential token reuse / compromised session -> revoke all
    user.refreshTokenHash = undefined as any;
    await user.save();
    throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401, code: 'UNAUTHORIZED' });
  }

  const newAccessToken = signAccess({ userId: user._id.toString() });
  const newRefreshToken = signRefresh({ userId: user._id.toString() });
  
  user.refreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return; // Generic success to prevent enumeration
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.save();
  sendPasswordResetEmail(user.email, resetToken).catch(console.error);
};

export const resetPassword = async (data: any) => {
  const tokenHash = crypto.createHash('sha256').update(data.token).digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw Object.assign(new Error('Token is invalid or has expired'), { statusCode: 400, code: 'BAD_REQUEST' });
  }

  user.passwordHash = await hashPassword(data.password);
  user.passwordResetToken = undefined as any;
  user.passwordResetExpires = undefined as any;
  
  // Also revoke active sessions on password reset
  user.refreshTokenHash = undefined as any;
  
  await user.save();
};
