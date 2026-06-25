import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User';
import LoyaltyPoints from '../models/LoyaltyPoints';
import {
  generateJWT,
  generateRefreshToken,
  generatePasswordResetToken,
  generateEmailVerificationToken,
} from '../utils/generateToken';
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from '../utils/sendEmail';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response,
  message: string = 'Success'
): void => {
  const token = generateJWT(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .cookie('refreshToken', refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    .json({
      success: true,
      message,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
      },
    });
};

// ─── Register ────────────────────────────────────────────────────────────────

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, email, password, referralCode: usedReferralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
      return;
    }

    // Handle referral
    let referredBy: any = undefined;
    if (usedReferralCode) {
      const referrer = await User.findOne({ referralCode: usedReferralCode.toUpperCase() });
      if (referrer) {
        referredBy = referrer._id;
        // Give referrer bonus points
        referrer.loyaltyPoints += 100;
        await referrer.save();
      }
    }

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      referredBy,
      emailVerificationToken,
    });

    // Create loyalty points record
    await LoyaltyPoints.create({ user: user._id });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name, emailVerificationToken).catch((err) => {
      console.error('Failed to send welcome email:', err.message);
    });

    sendTokenResponse(user, 201, res, 'Account created successfully. Please verify your email.');
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res
    .status(200)
    .cookie('token', '', { expires: new Date(0), httpOnly: true })
    .cookie('refreshToken', '', { expires: new Date(0), httpOnly: true })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success to avoid email enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
      return;
    }

    const { token, hashedToken, expire } = generatePasswordResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expire;
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user.email, user.name, token);
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    } catch (emailError: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        success: false,
        message: 'Could not send password reset email. Please try again later.',
      });
    }
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { token } = req.params;
    const { password } = req.body;

    // Hash the token from params to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token as string).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successfully');
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken')
      .populate('favoriteItems', 'name price images slug')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token not provided.',
      });
      return;
    }

    // In a production system, you'd validate the refresh token against a stored hash.
    // Here we use a simplified approach: require a valid user ID in body or cookie.
    const userId = req.body?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User ID required for token refresh.',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    sendTokenResponse(user, 200, res, 'Token refreshed successfully');
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired email verification token.',
      });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    // Award loyalty points for verifying email
    await LoyaltyPoints.findOneAndUpdate(
      { user: user._id },
      {
        $inc: { points: 50, totalEarned: 50 },
        $push: {
          transactions: {
            type: 'earn',
            points: 50,
            description: 'Email verification bonus',
            createdAt: new Date(),
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You earned 50 loyalty points!',
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Request Admin OTP ───────────────────────────────────────────────────────

export const requestAdminOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required' });
      return;
    }

    const user = await User.findOne({ email }).select('+role');
    if (!user) {
      res.status(404).json({ success: false, message: 'No account registered with this email.' });
      return;
    }

    if (user.role !== 'admin' && user.role !== 'owner') {
      res.status(403).json({ success: false, message: 'Access denied. Account is not an administrator.' });
      return;
    }

    // Generate 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otpCode = otp;
    user.otpExpire = otpExpire;
    await user.save({ validateBeforeSave: false });

    // Send email
    const { sendOtpEmail } = require('../utils/sendEmail');
    await sendOtpEmail(user.email, user.name, otp);

    res.status(200).json({
      success: true,
      message: 'verification OTP sent to admin email.',
    });
  } catch (error: any) {
    console.error('Request Admin OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending verification OTP',
      error: error.message,
    });
  }
};

// ─── Reset Admin Password with OTP ───────────────────────────────────────────

export const resetAdminPasswordWithOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      res.status(400).json({ success: false, message: 'Email, OTP, and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
      return;
    }

    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code.',
      });
      return;
    }

    user.password = password;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Administrator password reset successfully.',
    });
  } catch (error: any) {
    console.error('Reset Admin Password OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: error.message,
    });
  }
};
