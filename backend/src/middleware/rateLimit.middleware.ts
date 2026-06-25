import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * General rate limiter: 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  },
  validate: { ip: false },
});

/**
 * Auth rate limiter: 5 requests per 15 minutes (login/register/forgot-password)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
    });
  },
  skip: (req: Request) => {
    return process.env.NODE_ENV === 'test';
  },
  validate: { ip: false },
});

/**
 * Order rate limiter: 20 requests per 15 minutes
 */
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many order requests, please try again after 15 minutes.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many order requests from this IP, please try again after 15 minutes.',
    });
  },
  skip: (req: Request) => {
    return process.env.NODE_ENV === 'test';
  },
  validate: { ip: false },
});

/**
 * Upload rate limiter: 10 requests per hour
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many upload requests, please try again after an hour.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many upload requests from this IP, please try again after an hour.',
    });
  },
  skip: (req: Request) => {
    return process.env.NODE_ENV === 'test';
  },
  validate: { ip: false },
});
