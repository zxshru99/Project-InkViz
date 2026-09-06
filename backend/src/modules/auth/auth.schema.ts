import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only digits'),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    type: z.enum(['verification', 'password_reset']).default('verification'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email format').optional(),
      otp: z
        .string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only digits')
        .optional(),
      token: z.string().min(1, 'Token is required').optional(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    })
    .refine((data) => Boolean(data.token || (data.email && data.otp)), {
      message: 'Either token or email and 6-digit OTP must be provided',
      path: ['otp'],
    }),
});
