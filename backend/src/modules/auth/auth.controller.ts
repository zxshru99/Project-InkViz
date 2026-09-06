import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email with the 6-digit OTP code sent to your inbox.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.verifyEmailOtp(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Email successfully verified.',
      data: { accessToken, user },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.resendOtp(req.body);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    
    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, data: { accessToken, user } });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: oldRefreshToken } = req.cookies;
    if (!oldRefreshToken) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token provided' } });
      return;
    }

    const { accessToken, refreshToken } = await authService.refresh(oldRefreshToken);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, data: { accessToken } });
  } catch (error) {
    res.clearCookie('refreshToken');
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    if (userId) {
      await authService.logout(userId);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
