import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../users/user.model';
import { sendOtpEmail, sendVerificationEmail, sendPasswordResetEmail } from '../../services/email.service';
import { signAccess, signRefresh } from '../../utils/jwt';
import { safeCompare } from '../../utils/tokenCompare';

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const register = async (data: any) => {
  const email = data.email.toLowerCase().trim();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // If account exists but email was never verified, refresh OTP and update credentials
    if (!existingUser.isEmailVerified) {
      const otp = generateOtp();
      existingUser.passwordHash = await hashPassword(data.password);
      existingUser.name = data.name;
      existingUser.emailOtpHash = hashOtp(otp);
      existingUser.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await existingUser.save();

      sendOtpEmail(existingUser.email, otp, 'verification').catch(console.error);

      return {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        requireOtp: true,
        ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? { devOtp: otp } : {}),
      };
    }
    throw Object.assign(new Error('Email already registered'), { statusCode: 409, code: 'CONFLICT' });
  }

  const passwordHash = await hashPassword(data.password);
  const otp = generateOtp();
  const emailOtpHash = hashOtp(otp);
  const emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = new User({
    name: data.name,
    email,
    passwordHash,
    isEmailVerified: false,
    emailOtpHash,
    emailOtpExpires,
  });

  await user.save();

  // Send OTP verification email
  sendOtpEmail(user.email, otp, 'verification').catch(console.error);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    requireOtp: true,
    ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? { devOtp: otp } : {}),
  };
};

export const verifyEmailOtp = async (data: { email: string; otp: string }) => {
  const email = data.email.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404, code: 'NOT_FOUND' });
  }

  if (user.isEmailVerified) {
    const accessToken = signAccess({ userId: user._id.toString() });
    const refreshToken = signRefresh({ userId: user._id.toString() });
    user.refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await user.save();
    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isEmailVerified: true,
      },
    };
  }

  if (!user.emailOtpHash || !user.emailOtpExpires || user.emailOtpExpires < new Date()) {
    throw Object.assign(new Error('Verification code has expired. Please request a new code.'), {
      statusCode: 400,
      code: 'OTP_EXPIRED',
    });
  }

  const inputHash = hashOtp(data.otp);
  if (!safeCompare(inputHash, user.emailOtpHash)) {
    throw Object.assign(new Error('Invalid verification code'), {
      statusCode: 400,
      code: 'INVALID_OTP',
    });
  }

  user.isEmailVerified = true;
  user.emailOtpHash = undefined as any;
  user.emailOtpExpires = undefined as any;
  user.emailVerificationToken = undefined as any;

  const accessToken = signAccess({ userId: user._id.toString() });
  const refreshToken = signRefresh({ userId: user._id.toString() });
  user.refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      isEmailVerified: true,
    },
  };
};

export const resendOtp = async (data: { email: string; type: 'verification' | 'password_reset' }) => {
  const email = data.email.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message: 'If an account exists, a new verification code has been sent.',
    };
  }

  const otp = generateOtp();
  const hashed = hashOtp(otp);
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  if (data.type === 'verification') {
    if (user.isEmailVerified) {
      return { message: 'Email is already verified.' };
    }
    user.emailOtpHash = hashed;
    user.emailOtpExpires = expires;
    await user.save();
    sendOtpEmail(user.email, otp, 'verification').catch(console.error);
  } else {
    user.passwordResetOtpHash = hashed;
    user.passwordResetExpires = expires;
    await user.save();
    sendOtpEmail(user.email, otp, 'password_reset').catch(console.error);
  }

  return {
    message: 'Verification code resent successfully.',
    ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? { devOtp: otp } : {}),
  };
};

export const login = async (data: any) => {
  const user = await User.findOne({ email: data.email.toLowerCase().trim() });

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

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      isEmailVerified: user.isEmailVerified,
    },
  };
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
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return {
      message: 'If an account exists, a reset code has been sent to your email.',
    };
  }

  const otp = generateOtp();
  user.passwordResetOtpHash = hashOtp(otp);
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await user.save();
  sendOtpEmail(user.email, otp, 'password_reset').catch(console.error);

  return {
    message: 'If an account exists, a reset code has been sent to your email.',
    ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? { devOtp: otp } : {}),
  };
};

export const resetPassword = async (data: any) => {
  let user;

  if (data.otp && data.email) {
    const email = data.email.toLowerCase().trim();
    user = await User.findOne({
      email,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user || !user.passwordResetOtpHash) {
      throw Object.assign(new Error('Reset code is invalid or has expired'), {
        statusCode: 400,
        code: 'BAD_REQUEST',
      });
    }

    const inputHash = hashOtp(data.otp);
    if (!safeCompare(inputHash, user.passwordResetOtpHash)) {
      throw Object.assign(new Error('Invalid reset code'), {
        statusCode: 400,
        code: 'INVALID_OTP',
      });
    }
  } else if (data.token) {
    const tokenHash = crypto.createHash('sha256').update(data.token).digest('hex');
    user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw Object.assign(new Error('Token is invalid or has expired'), {
        statusCode: 400,
        code: 'BAD_REQUEST',
      });
    }
  } else {
    throw Object.assign(new Error('Reset code or token is required'), {
      statusCode: 400,
      code: 'BAD_REQUEST',
    });
  }

  user.passwordHash = await hashPassword(data.password);
  user.passwordResetToken = undefined as any;
  user.passwordResetOtpHash = undefined as any;
  user.passwordResetExpires = undefined as any;
  
  // Revoke active sessions on password reset
  user.refreshTokenHash = undefined as any;
  
  await user.save();
  return { message: 'Password has been reset successfully.' };
};
