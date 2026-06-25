import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import Order from '../models/Order';
import User from '../models/User';
import Reservation from '../models/Reservation';
import Notification from '../models/Notification';
import mongoose from 'mongoose';

const router = Router();

// Apply admin protection to all routes in this file
router.use(requireAuth, requireRole('admin', 'owner'));

// ─── GET /dashboard (Dashboard Stats Summary) ──────────────────────────────────
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalRevenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalReservations = await Reservation.countDocuments({
      status: { $in: ['pending', 'confirmed'] },
    });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();

    const recentReservations = await Reservation.find()
      .sort({ date: 1, time: 1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          totalCustomers,
          totalReservations,
        },
        recentOrders,
        recentReservations,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /analytics/revenue (Revenue reports over last 30 days) ───────────────
router.get('/analytics/revenue', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: revenueData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error generating revenue analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /analytics/orders (Order volume reports and status breakdown) ─────────
router.get('/analytics/orders', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyOrders,
        statusBreakdown: orderStatusBreakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error generating order analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /users (List Users with search and filtering) ───────────────────────
router.get('/users', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20', role, search } = req.query as Record<
      string,
      string
    >;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-password')
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PATCH /users/:id/role (Change user role) ─────────────────────────────────
router.patch('/users/:id/role', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['customer', 'admin', 'owner'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role specified' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }

    // Owner protection: Only owner role can assign 'owner' role
    if (role === 'owner' && req.user!.role !== 'owner') {
      res.status(403).json({
        success: false,
        message: 'Only owners can promote users to owner role',
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check if modifying owner role and user is not owner
    if (user.role === 'owner' && req.user!.role !== 'owner') {
      res.status(403).json({
        success: false,
        message: 'Cannot modify role of an owner',
      });
      return;
    }

    user.role = role as any;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating user role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /notifications (Get admin notifications) ────────────────────────────
router.get('/notifications', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notifications = await Notification.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
