import { Router } from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  validateCoupon,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { orderLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// ─── Customer Routes ──────────────────────────────────────────────────────────

// @route  POST /api/v1/orders
// @desc   Place a new order
router.post('/', requireAuth, orderLimiter, placeOrder);

// @route  GET /api/v1/orders/my-orders
// @desc   Get logged-in user's orders
router.get('/my-orders', requireAuth, getMyOrders);

// @route  POST /api/v1/orders/validate-coupon
// @desc   Validate a coupon code
router.post('/validate-coupon', requireAuth, validateCoupon);

// @route  POST /api/v1/orders/:id/cancel
// @desc   Cancel an order
router.post('/:id/cancel', requireAuth, cancelOrder);

// @route  GET /api/v1/orders/:id
// @desc   Get a single order by ID
router.get('/:id', requireAuth, getOrderById);

// ─── Admin/Owner Routes ───────────────────────────────────────────────────────

// @route  GET /api/v1/orders
// @desc   Get all orders (admin/owner)
router.get('/', requireAuth, requireRole('admin', 'owner'), getAllOrders);

// @route  PATCH /api/v1/orders/:id/status
// @desc   Update order status (admin/owner)
router.patch('/:id/status', requireAuth, requireRole('admin', 'owner'), updateOrderStatus);

export default router;
