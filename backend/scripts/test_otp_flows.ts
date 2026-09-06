import mongoose from 'mongoose';
import { User } from '../src/modules/users/user.model';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5001/api/v1';
const timestamp = Date.now();
const testEmail = `otp_verify_${timestamp}@inkviz.app`;
const testPassword = 'InitialSecurePassword123!';
const newPassword = 'ResetSecurePassword456!';
const testName = `OTP User ${timestamp}`;

async function main() {
  console.log('🚀 Starting Zero-Bypass CLI + MongoDB OTP Testing...');

  // 1. Connect directly to MongoDB Atlas
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected directly to MongoDB Atlas.');

  // ==========================================
  // STEP 1: Registration with Email OTP
  // ==========================================
  console.log('\n--- 1. Testing Registration Endpoint ---');
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword,
    }),
  });

  const regJson = await regRes.json() as any;
  console.log('Register HTTP Status:', regRes.status);
  console.log('Register Response:', JSON.stringify(regJson, null, 2));

  if (regRes.status !== 201 || !regJson.data?.requireOtp) {
    throw new Error('Registration failed or requireOtp not returned');
  }

  const otp = regJson.data.devOtp;
  console.log(`Generated OTP code (Dev Simulation): ${otp}`);

  // Immediate MongoDB Verification #1
  console.log('\n🔎 Immediate MongoDB Verification (Post-Register)...');
  const dbUserAfterReg = await User.findOne({ email: testEmail });
  if (!dbUserAfterReg) throw new Error('User was not created in MongoDB');
  console.log(`DB User ID: ${dbUserAfterReg._id}`);
  console.log(`DB isEmailVerified: ${dbUserAfterReg.isEmailVerified} (Expected: false)`);
  console.log(`DB emailOtpHash: ${dbUserAfterReg.emailOtpHash ? 'PRESENT (' + dbUserAfterReg.emailOtpHash.substring(0, 12) + '...)' : 'MISSING'}`);
  console.log(`DB emailOtpExpires: ${dbUserAfterReg.emailOtpExpires}`);

  if (dbUserAfterReg.isEmailVerified !== false || !dbUserAfterReg.emailOtpHash) {
    throw new Error('MongoDB verification failed: isEmailVerified is not false or OTP hash is missing');
  }

  // ==========================================
  // STEP 2: Verify Email with OTP
  // ==========================================
  console.log('\n--- 2. Testing Verify Email OTP Endpoint ---');
  const verifyRes = await fetch(`${API_BASE}/auth/verify-email-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      otp,
    }),
  });

  const verifyJson = await verifyRes.json() as any;
  console.log('Verify HTTP Status:', verifyRes.status);
  console.log('Verify Response:', JSON.stringify(verifyJson, null, 2));

  if (verifyRes.status !== 200 || !verifyJson.data?.accessToken) {
    throw new Error('Verify email OTP failed');
  }

  // Immediate MongoDB Verification #2
  console.log('\n🔎 Immediate MongoDB Verification (Post-Verify)...');
  const dbUserAfterVerify = await User.findOne({ email: testEmail });
  if (!dbUserAfterVerify) throw new Error('User not found in MongoDB');
  console.log(`DB isEmailVerified: ${dbUserAfterVerify.isEmailVerified} (Expected: true)`);
  console.log(`DB emailOtpHash: ${dbUserAfterVerify.emailOtpHash || 'CLEARED (Success)'}`);

  if (dbUserAfterVerify.isEmailVerified !== true || dbUserAfterVerify.emailOtpHash) {
    throw new Error('MongoDB verification failed: isEmailVerified is not true or OTP hash was not cleared');
  }

  // ==========================================
  // STEP 3: Forgot Password Request (OTP)
  // ==========================================
  console.log('\n--- 3. Testing Forgot Password Endpoint ---');
  const forgotRes = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });

  const forgotJson = await forgotRes.json() as any;
  console.log('Forgot Password HTTP Status:', forgotRes.status);
  console.log('Forgot Password Response:', JSON.stringify(forgotJson, null, 2));

  if (forgotRes.status !== 200) throw new Error('Forgot password request failed');

  const resetOtp = forgotJson.data?.devOtp;
  console.log(`Reset OTP code (Dev Simulation): ${resetOtp}`);

  // Immediate MongoDB Verification #3
  console.log('\n🔎 Immediate MongoDB Verification (Post-Forgot)...');
  const dbUserAfterForgot = await User.findOne({ email: testEmail });
  if (!dbUserAfterForgot) throw new Error('User not found in MongoDB');
  console.log(`DB passwordResetOtpHash: ${dbUserAfterForgot.passwordResetOtpHash ? 'PRESENT (' + dbUserAfterForgot.passwordResetOtpHash.substring(0, 12) + '...)' : 'MISSING'}`);
  console.log(`DB passwordResetExpires: ${dbUserAfterForgot.passwordResetExpires}`);

  if (!dbUserAfterForgot.passwordResetOtpHash) {
    throw new Error('MongoDB verification failed: passwordResetOtpHash was not set in DB');
  }

  // ==========================================
  // STEP 4: Reset Password with OTP
  // ==========================================
  console.log('\n--- 4. Testing Reset Password Endpoint with OTP ---');
  const resetRes = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      otp: resetOtp,
      password: newPassword,
    }),
  });

  const resetJson = await resetRes.json() as any;
  console.log('Reset Password HTTP Status:', resetRes.status);
  console.log('Reset Password Response:', JSON.stringify(resetJson, null, 2));

  if (resetRes.status !== 200) throw new Error('Reset password failed');

  // Immediate MongoDB Verification #4
  console.log('\n🔎 Immediate MongoDB Verification (Post-Reset)...');
  const dbUserAfterReset = await User.findOne({ email: testEmail });
  if (!dbUserAfterReset) throw new Error('User not found in MongoDB');
  console.log(`DB passwordResetOtpHash: ${dbUserAfterReset.passwordResetOtpHash || 'CLEARED (Success)'}`);
  console.log(`DB passwordResetExpires: ${dbUserAfterReset.passwordResetExpires || 'CLEARED (Success)'}`);

  if (dbUserAfterReset.passwordResetOtpHash) {
    throw new Error('MongoDB verification failed: passwordResetOtpHash was not cleared');
  }

  // ==========================================
  // STEP 5: Login with the Newly Set Password
  // ==========================================
  console.log('\n--- 5. Testing Login with New Password ---');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: newPassword,
    }),
  });

  const loginJson = await loginRes.json() as any;
  console.log('Login HTTP Status:', loginRes.status);
  console.log('Login Response:', JSON.stringify(loginJson, null, 2));

  if (loginRes.status !== 200 || !loginJson.data?.accessToken) {
    throw new Error('Login with new password failed');
  }

  console.log('\n🎉 ALL OTP VERIFICATION & FORGOT PASSWORD FLOWS PASSED WITH 100% SUCCESS!');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('❌ Test execution error:', err);
  await mongoose.disconnect();
  process.exit(1);
});
