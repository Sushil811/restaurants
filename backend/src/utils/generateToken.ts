import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate JWT access token
 */
export const generateJWT = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  const expire = process.env.JWT_EXPIRE || '7d';

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: expire as any,
    issuer: 'lumiere-api',
    audience: 'lumiere-client',
  });
};

/**
 * Generate a secure refresh token (random hex string)
 */
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Generate unique order number in format LUM-000001
 */
export const generateOrderNumber = async (currentCount: number): Promise<string> => {
  const padded = String(currentCount + 1).padStart(6, '0');
  return `LUM-${padded}`;
};

/**
 * Generate a 6-character alphanumeric confirmation code for reservations
 */
export const generateConfirmationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate a unique referral code with LUM prefix (9 chars total)
 */
export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'LUM';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate a crypto-secure password reset token (hex) and its hash for storage
 */
export const generatePasswordResetToken = (): { token: string; hashedToken: string; expire: Date } => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  return { token, hashedToken, expire };
};

/**
 * Generate email verification token
 */
export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
