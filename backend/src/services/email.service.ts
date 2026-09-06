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

export const sendOtpEmail = async (
  email: string,
  otp: string,
  purpose: 'verification' | 'password_reset'
): Promise<void> => {
  const isVerification = purpose === 'verification';
  const subject = isVerification
    ? 'Inkviz - Verify Your Account OTP'
    : 'Inkviz - Password Reset OTP Code';
  const actionTitle = isVerification ? 'Verify Your Account' : 'Password Reset Request';
  const actionDesc = isVerification
    ? 'Thank you for signing up for Inkviz. Use the verification code below to activate your account:'
    : 'We received a request to reset the password for your Inkviz account. Use the code below to reset your password:';

  if (!env.SMTP_PASS && env.NODE_ENV === 'development') {
    logger.info(`[DEV SIMULATION] ${purpose.toUpperCase()} OTP for ${email}: ${otp}`);
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0e; color: #f3f4f6; margin: 0; padding: 40px 20px; }
        .container { max-width: 480px; margin: 0 auto; background: #141618; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
        .logo { font-size: 20px; font-weight: 700; letter-spacing: -0.04em; color: #ffffff; margin-bottom: 24px; display: inline-block; }
        .title { font-size: 22px; font-weight: 600; color: #ffffff; margin-bottom: 8px; }
        .desc { font-size: 14px; color: #9ca3af; line-height: 1.5; margin-bottom: 24px; }
        .otp-box { background: #1f2226; border: 1px solid #3f3f46; border-radius: 12px; padding: 18px 24px; text-align: center; margin-bottom: 24px; }
        .otp-code { font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff; }
        .expiry { font-size: 12px; color: #71717a; text-align: center; margin-bottom: 24px; }
        .footer { font-size: 12px; color: #52525b; border-top: 1px solid #27272a; padding-top: 20px; margin-top: 24px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">INKVIZ</div>
        <div class="title">${actionTitle}</div>
        <div class="desc">${actionDesc}</div>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        <div class="expiry">This verification code expires in 10 minutes.</div>
        <div class="footer">
          If you did not request this email, please safely disregard it. Your account remains secure.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP email (${purpose}) sent to ${email.substring(0, 3)}...`);
  } catch (error) {
    logger.error(`Error sending ${purpose} OTP email to ${email}:`, error);
  }
};

