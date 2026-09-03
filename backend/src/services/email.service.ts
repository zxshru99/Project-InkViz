import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

  if (!env.SMTP_PASS && env.NODE_ENV === 'development') {
    logger.info(`[DEV SIMULATION] Verification email for ${email}: ${verifyUrl}`);
    return;
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Inkviz - Verify your email',
    html: `
      <h1>Welcome to Inkviz!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent (email hash: ${Buffer.from(email).toString('base64').substring(0, 8)}...)`);
  } catch (error) {
    logger.error('Error sending verification email', error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

  if (!env.SMTP_PASS && env.NODE_ENV === 'development') {
    logger.info(`[DEV SIMULATION] Password reset email for ${email}: ${resetUrl}`);
    return;
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Inkviz - Password Reset',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>This link is valid for 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent (email hash: ${Buffer.from(email).toString('base64').substring(0, 8)}...)`);
  } catch (error) {
    logger.error('Error sending password reset email', error);
  }
};
