import { sendEmail } from './email';

export function generateOTP(length: number = 6): string {
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}

export function getExpiryDate(minutes: number = 10): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.toISOString();
}

export async function sendOTP(email: string, code: string) {
  await sendEmail(
    { EMAIL_QUEUE: null }, // TODO: wire queue
    email,
    'otp',
    { code, brand: 'SkillPage', supportEmail: 'support@skillpage.io' }
  );
}

export const OTP_CONFIG = {
  length: 6,
  ttlMinutes: 10,
  maxAttempts: 5,
  rateLimit: {
    requestsPerHour: 3,
    windowMs: 60 * 60 * 1000,
  },
};
