import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import * as stripeService from '../services/stripe.service';

// ─── Create Stripe Payment Intent ───────────────────────────────────────────
export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({ success: false, message: 'Order ID is required' });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Check if the order belongs to the user
    if (order.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this order',
      });
      return;
    }

    if (order.paymentStatus === 'paid') {
      res.status(400).json({ success: false, message: 'Order is already paid' });
      return;
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      order.total,
      'inr',
      {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: req.user!._id.toString(),
      }
    );

    // Save payment intent ID to order
    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.total,
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Stripe Webhook Handler ──────────────────────────────────────────────────
export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    res.status(400).json({ success: false, message: 'Stripe signature missing' });
    return;
  }

  let event;
  try {
    // Support both rawBody (if saved by a global verify middleware) or req.body
    const rawBody = (req as any).rawBody || req.body;
    event = stripeService.constructWebhookEvent(rawBody, sig);
  } catch (err: any) {
    console.error('⚠️ Stripe webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await stripeService.handlePaymentSucceeded(event);
        break;
      case 'payment_intent.payment_failed':
        await stripeService.handlePaymentFailed(event);
        break;
      default:
        console.log(`ℹ️ Unhandled Stripe event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe webhook event:', error);
    res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

// ─── Get My Payments ─────────────────────────────────────────────────────────
export const getMyPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find({
      user: req.user!._id,
      paymentMethod: 'stripe',
      stripePaymentIntentId: { $exists: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    const payments = orders.map((order) => ({
      orderId: order._id,
      orderNumber: order.orderNumber,
      amount: order.total,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.stripePaymentIntentId,
      createdAt: order.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
