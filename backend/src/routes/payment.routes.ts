import express, { Router } from 'express';
import {
  createPaymentIntent,
  handleStripeWebhook,
  getMyPayments,
} from '../controllers/payment.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// ─── POST /create-payment-intent (Auth: Initiate Payment) ────────────────────
router.post('/create-payment-intent', requireAuth, createPaymentIntent);

// ─── POST /webhook (Public: Stripe Webhook, handles raw body verification) ───
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// ─── GET /my-payments (Auth: Get customer payments) ──────────────────────────
router.get('/my-payments', requireAuth, getMyPayments);

export default router;
