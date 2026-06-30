import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import MenuItem from '../models/MenuItem';
import Coupon from '../models/Coupon';
import User from '../models/User';
import LoyaltyPoints from '../models/LoyaltyPoints';
import Notification from '../models/Notification';
import { sendOrderConfirmationEmail } from '../utils/sendEmail';

const TAX_RATE = 0.05; // 5%
const DELIVERY_FEE = 50;
const FREE_DELIVERY_THRESHOLD = 500;
const LOYALTY_POINTS_PER_RUPEE = 0.1; // 1 point per 10 rupees

// ─── Place Order ──────────────────────────────────────────────────────────────

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items: rawItems,
      deliveryAddress,
      paymentMethod,
      couponCode,
      specialInstructions,
    } = req.body;

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      await session.abortTransaction();
      res.status(400).json({ success: false, message: 'Order must contain at least one item' });
      return;
    }

    if (!deliveryAddress) {
      await session.abortTransaction();
      res.status(400).json({ success: false, message: 'Delivery address is required' });
      return;
    }

    // ── Validate & price each item ──
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const rawItem of rawItems) {
      const { menuItemId, menuItem: incomingMenuItem, quantity = 1, customizations = [] } = rawItem;
      const idToUse = menuItemId || incomingMenuItem;

      if (!mongoose.Types.ObjectId.isValid(idToUse)) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: `Invalid menu item ID: ${idToUse}` });
        return;
      }

      const menuItem = await MenuItem.findById(idToUse).lean();
      if (!menuItem) {
        await session.abortTransaction();
        res.status(404).json({ success: false, message: `Menu item not found: ${idToUse}` });
        return;
      }

      if (!menuItem.isAvailable) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: `"${menuItem.name}" is currently unavailable` });
        return;
      }

      const unitPrice = menuItem.discountPrice && menuItem.discountPrice < menuItem.price
        ? menuItem.discountPrice
        : menuItem.price;

      // Add customization price
      let customizationTotal = 0;
      const resolvedCustomizations: any[] = [];
      for (const custom of customizations) {
        customizationTotal += custom.additionalPrice || 0;
        resolvedCustomizations.push({
          name: custom.name,
          option: custom.option,
          additionalPrice: custom.additionalPrice || 0,
        });
      }

      const itemTotal = (unitPrice + customizationTotal) * quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: unitPrice + customizationTotal,
        quantity,
        customizations: resolvedCustomizations,
        image: menuItem.images[0] || '',
      });
    }

    // ── Apply coupon ──
    let discount = 0;
    let couponId: mongoose.Types.ObjectId | undefined;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: { $exists: false } }],
      });

      if (!coupon) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
        return;
      }

      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        await session.abortTransaction();
        res.status(400).json({
          success: false,
          message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
        });
        return;
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        return;
      }

      const userId = req.user!._id.toString();
      if (coupon.usedBy.some((id) => id.toString() === userId)) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: 'You have already used this coupon' });
        return;
      }

      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }

      couponId = coupon._id as mongoose.Types.ObjectId;

      // Update coupon usage
      await Coupon.findByIdAndUpdate(
        coupon._id,
        {
          $inc: { usedCount: 1 },
          $push: { usedBy: req.user!._id },
        },
        { session }
      );
    }

    // ── Calculate fees ──
    const afterDiscount = subtotal - discount;
    const deliveryFee = afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100;
    const total = Math.round((afterDiscount + deliveryFee + tax) * 100) / 100;

    // ── Create order ──
    const [order] = await Order.create(
      [
        {
          user: req.user!._id,
          items: orderItems,
          subtotal: Math.round(subtotal * 100) / 100,
          deliveryFee,
          tax,
          discount: Math.round(discount * 100) / 100,
          total,
          coupon: couponId,
          paymentMethod,
          deliveryAddress,
          specialInstructions,
          estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
          trackingUpdates: [
            {
              status: 'pending',
              message: 'Order placed successfully. Waiting for confirmation.',
              timestamp: new Date(),
            },
          ],
        },
      ],
      { session }
    );

    // ── Update user order history ──
    await User.findByIdAndUpdate(
      req.user!._id,
      { $push: { orderHistory: order._id } },
      { session }
    );

    // ── Award loyalty points ──
    const pointsEarned = Math.floor(total * LOYALTY_POINTS_PER_RUPEE);
    if (pointsEarned > 0) {
      await LoyaltyPoints.findOneAndUpdate(
        { user: req.user!._id },
        {
          $inc: { points: pointsEarned, totalEarned: pointsEarned },
          $push: {
            transactions: {
              type: 'earn',
              points: pointsEarned,
              description: `Points earned from order ${order.orderNumber}`,
              orderId: order._id,
              createdAt: new Date(),
            },
          },
        },
        { upsert: true, session }
      );

      await User.findByIdAndUpdate(
        req.user!._id,
        { $inc: { loyaltyPoints: pointsEarned } },
        { session }
      );
    }

    await session.commitTransaction();

    // ── Create notification (non-blocking) ──
    Notification.create({
      user: req.user!._id,
      title: 'Order Placed Successfully!',
      message: `Your order ${order.orderNumber} has been placed. Estimated delivery: 45 minutes.`,
      type: 'order',
      link: `/orders/${order.orderNumber}`,
    }).catch(console.error);

    // ── Send email (non-blocking) ──
    const user = await User.findById(req.user!._id).lean();
    if (user) {
      sendOrderConfirmationEmail(user.email, user.name, {
        orderNumber: order.orderNumber,
        items: orderItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        paymentMethod,
        estimatedDelivery: order.estimatedDelivery,
      }).catch(console.error);
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.menuItem', 'name images');

    res.status(201).json({
      success: true,
      message: `Order placed successfully! You earned ${pointsEarned} loyalty points.`,
      data: populatedOrder,
    });
  } catch (error: any) {
    await session.abortTransaction();
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error placing order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    session.endSession();
  }
};

// ─── Get My Orders ────────────────────────────────────────────────────────────

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '10', status } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, any> = { user: req.user!._id };
    if (status) query.orderStatus = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.menuItem', 'name images slug')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Get Order By ID ──────────────────────────────────────────────────────────

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name images slug')
      .lean();

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Ensure user can only see their own orders (unless admin/owner)
    const isOwner = order.user && (order.user as any)._id.toString() === req.user!._id.toString();
    const isAdmin = ['admin', 'owner'].includes(req.user!.role);

    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Validate Coupon ──────────────────────────────────────────────────────────

export const validateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { couponCode, orderAmount } = req.body;

    if (!couponCode) {
      res.status(400).json({ success: false, message: 'Coupon code is required' });
      return;
    }

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: { $exists: false } }],
    });

    if (!coupon) {
      res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
      return;
    }

    if (coupon.minOrderValue && orderAmount < coupon.minOrderValue) {
      res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`,
      });
      return;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      return;
    }

    const userId = req.user!._id.toString();
    if (coupon.usedBy.some((id) => id.toString() === userId)) {
      res.status(400).json({ success: false, message: 'You have already used this coupon' });
      return;
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      paymentStatus,
      dateFrom,
      dateTo,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, any> = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .populate('items.menuItem', 'name images')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Update Order Status (Admin) ──────────────────────────────────────────────

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        $push: {
          trackingUpdates: {
            status,
            message: message || `Order status updated to ${status}`,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Notify user
    Notification.create({
      user: order.user,
      title: `Order ${status.replace(/_/g, ' ').toUpperCase()}`,
      message: message || `Your order ${order.orderNumber} status has been updated to ${status}.`,
      type: 'order',
      link: `/orders/${order.orderNumber}`,
    }).catch(console.error);

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Cancel Order ─────────────────────────────────────────────────────────────

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Authorize
    const isOwner = order.user.toString() === req.user!._id.toString();
    const isAdmin = ['admin', 'owner'].includes(req.user!.role);
    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
      return;
    }

    // Only pending/confirmed orders can be cancelled by customers
    if (!isAdmin && !['pending', 'confirmed'].includes(order.orderStatus)) {
      res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage. Please contact support.',
      });
      return;
    }

    order.orderStatus = 'cancelled';
    order.trackingUpdates.push({
      status: 'cancelled',
      message: reason || 'Order cancelled by customer',
      timestamp: new Date(),
    });

    await order.save();

    // Reverse loyalty points if awarded
    const pointsToReverse = Math.floor(order.total * LOYALTY_POINTS_PER_RUPEE);
    if (pointsToReverse > 0) {
      await LoyaltyPoints.findOneAndUpdate(
        { user: order.user },
        {
          $inc: { points: -pointsToReverse, totalRedeemed: pointsToReverse },
          $push: {
            transactions: {
              type: 'redeem',
              points: pointsToReverse,
              description: `Points reversed for cancelled order ${order.orderNumber}`,
              orderId: order._id,
              createdAt: new Date(),
            },
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};
