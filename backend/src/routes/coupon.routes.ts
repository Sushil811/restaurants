import { Router, Request, Response, NextFunction } from 'express';
import Coupon from '../models/Coupon';
import User from '../models/User';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateCoupon } from '../controllers/order.controller';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = Router();

// ─── GET / (Public/Admin: Get Coupons) ────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let isAdmin = false;
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
        const user = await User.findById(decoded.id);
        if (user && ['admin', 'owner'].includes(user.role)) {
          isAdmin = true;
        }
      } catch (err) {
        // Fail silently and treat as public user
      }
    }

    const query: any = {};
    if (!isAdmin) {
      query.isActive = true;
      query.$or = [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: { $exists: false } },
      ];
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving coupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST / (Admin: Create Coupon) ───────────────────────────────────────────
router.post('/', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue = 0,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive = true,
    } = req.body;

    if (!code || !description || !discountType || discountValue === undefined) {
      res.status(400).json({
        success: false,
        message: 'Code, description, discountType, and discountValue are required',
      });
      return;
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Coupon code already exists' });
      return;
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      expiresAt,
      usageLimit,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error creating coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PUT /:id (Admin: Update Coupon) ──────────────────────────────────────────
router.put('/:id', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid coupon ID' });
      return;
    }

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      const existing = await Coupon.findOne({
        code: updateData.code,
        _id: { $ne: id },
      });
      if (existing) {
        res.status(400).json({ success: false, message: 'Coupon code already exists' });
        return;
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── DELETE /:id (Admin: Delete Coupon) ───────────────────────────────────────
router.delete('/:id', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid coupon ID' });
      return;
    }

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST /validate (Auth: Validate Coupon) ──────────────────────────────────
router.post('/validate', requireAuth, validateCoupon);

export default router;
