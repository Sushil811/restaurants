import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  refreshToken,
  verifyEmail,
  requestAdminOtp,
  resetAdminPasswordWithOtp,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { body } from 'express-validator';

const router = Router();

// ─── Validation Rules ─────────────────────────────────────────────────────────

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
];

const resetPasswordValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// @route  POST /api/v1/auth/register
// @access Public (rate limited)
router.post('/register', authLimiter, registerValidation, register);

// @route  POST /api/v1/auth/login
// @access Public (rate limited)
router.post('/login', authLimiter, loginValidation, login);

// @route  POST /api/v1/auth/logout
// @access Private
router.post('/logout', requireAuth, logout);

// @route  POST /api/v1/auth/forgot-password
// @access Public (rate limited)
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);

// @route  POST /api/v1/auth/reset-password/:token
// @access Public
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

// @route  GET /api/v1/auth/me
// @access Private
router.get('/me', requireAuth, getMe);

// @route  POST /api/v1/auth/refresh-token
// @access Public
router.post('/refresh-token', refreshToken);

// @route  GET /api/v1/auth/verify-email/:token
// @access Public
router.get('/verify-email/:token', verifyEmail);

// @route  POST /api/v1/auth/admin/forgot-password-otp
// @access Public (rate limited)
router.post('/admin/forgot-password-otp', authLimiter, requestAdminOtp);

// @route  POST /api/v1/auth/admin/reset-password-otp
// @access Public
router.post('/admin/reset-password-otp', resetAdminPasswordWithOtp);

export default router;
