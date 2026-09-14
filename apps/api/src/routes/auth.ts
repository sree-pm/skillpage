import { Hono } from 'hono';
import { z } from 'zod';
import { createJWT } from '../lib/jwt';
import { generateOTP, getExpiryDate, sendOTP, OTP_CONFIG } from '../lib/otp';
import { rateLimit } from '../middleware/rate-limit';
import { writeAuditLog } from '../lib/audit';

const otpRequestSchema = z.object({ email: z.string().email() });
const otpVerifySchema = z.object({ email: z.string().email(), code: z.string().length(6) });

export const authRoutes = new Hono();

// Rate limit: 3 OTP requests per hour per IP
authRoutes.post('/otp/request', rateLimit({ max: 3, windowMs: 60 * 60 * 1000 }), async (c) => {
  try {
    const body = await c.req.json();
    const { email } = otpRequestSchema.parse(body);
    const db = c.env.DB;

    // Generate OTP
    const code = generateOTP(OTP_CONFIG.length);
    const otpId = crypto.randomUUID();
    const expiresAt = getExpiryDate(OTP_CONFIG.ttlMinutes);
    const now = new Date().toISOString();

    // Store OTP
    await db.prepare(`INSERT INTO otp_codes (id, email, code, expires_at, created_at) VALUES (?, ?, ?, ?, ?)`)
      .bind(otpId, email, code, expiresAt, now).run();

    // Send email
    await sendOTP(email, code);

    // Audit log
    await writeAuditLog(db, 'system', 'otp_requested', 'user', email, null, null, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');

    return c.json({ message: 'OTP sent to your email', expiresAt });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('OTP request error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to send OTP' } }, 500);
  }
});

authRoutes.post('/otp/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { email, code } = otpVerifySchema.parse(body);
    const db = c.env.DB;

    // Find OTP
    const otp: any = await db.prepare('SELECT * FROM otp_codes WHERE email = ? AND code = ? AND consumed = 0 ORDER BY created_at DESC LIMIT 1').bind(email, code).first();
    if (!otp) return c.json({ error: { code: 'INVALID_OTP', message: 'Invalid or expired OTP' } }, 400);

    // Check expiry
    if (new Date(otp.expires_at) < new Date()) {
      await db.prepare('UPDATE otp_codes SET consumed = 1 WHERE id = ?').bind(otp.id).run();
      return c.json({ error: { code: 'OTP_EXPIRED', message: 'OTP has expired' } }, 400);
    }

    // Check attempts
    if (otp.attempts >= OTP_CONFIG.maxAttempts) {
      await db.prepare('UPDATE otp_codes SET consumed = 1 WHERE id = ?').bind(otp.id).run();
      return c.json({ error: { code: 'OTP_MAX_ATTEMPTS', message: 'Maximum attempts reached' } }, 400);
    }

    // Mark as consumed
    await db.prepare('UPDATE otp_codes SET consumed = 1 WHERE id = ?').bind(otp.id).run();

    // Get or create user
    let user: any = await db.prepare('SELECT id, email, role, email_verified FROM users WHERE email = ?').bind(email).first();
    const isNewUser = !user;

    if (isNewUser) {
      const userId = crypto.randomUUID();
      const now = new Date().toISOString();
      await db.prepare(`INSERT INTO users (id, email, email_verified, role, created_at, updated_at) VALUES (?, ?, 1, 'user', ?, ?)`)
        .bind(userId, email, now, now).run();
      user = { id: userId, email, role: 'user', email_verified: 1 };

      // Create default profile
      const handle = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
      await db.prepare(`INSERT INTO profiles (id, user_id, handle, display_name, created_at, updated_at, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)`)
        .bind(userId, userId, handle, email.split('@')[0], now, now).run();
    } else if (!user.email_verified) {
      await db.prepare('UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?').bind(new Date().toISOString(), user.id).run();
      user.email_verified = 1;
    }

    // Issue JWT
    const token = await createJWT({ id: user.id, email: user.email, role: user.role });

    // Audit log
    await writeAuditLog(db, user.id, 'otp_verified', 'user', user.id, null, { isNewUser }, c.req.header('CF-Connecting-IP') || '', c.req.header('User-Agent') || '');

    return c.json({
      user: { id: user.id, email: user.email, role: user.role, email_verified: user.email_verified },
      token,
      isNewUser,
      message: 'Login successful',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('OTP verify error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to verify OTP' } }, 500);
  }
});
