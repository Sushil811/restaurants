import Stripe from 'stripe';
import Order from '../models/Order';

const stripe: any = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mockKey1234567890abcdef', {
  apiVersion: '2026-05-27.dahlia' as any,
});

/**
 * Create a Stripe PaymentIntent
 */
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'inr',
  metadata: Record<string, string> = {}
): Promise<any> => {
  // Stripe expects amount in the smallest currency unit (paise for INR)
  const amountInPaise = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency,
    metadata: {
      ...metadata,
      restaurant: 'Lumiere',
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

/**
 * Construct and verify a Stripe webhook event
 */
export const constructWebhookEvent = (
  payload: Buffer,
  sig: string
): any => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  return stripe.webhooks.constructEvent(payload, sig, webhookSecret);
};

/**
 * Handle payment_intent.succeeded webhook event
 */
export const handlePaymentSucceeded = async (
  event: any
): Promise<void> => {
  const paymentIntent = event.data.object as any;
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    console.warn('⚠️  payment_intent.succeeded: No orderId in metadata');
    return;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    console.warn(`⚠️  payment_intent.succeeded: Order ${orderId} not found`);
    return;
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.stripePaymentIntentId = paymentIntent.id;
  order.trackingUpdates.push({
    status: 'confirmed',
    message: 'Payment received. Your order is confirmed and being prepared.',
    timestamp: new Date(),
  });

  await order.save();
  console.log(`✅ Order ${order.orderNumber} payment confirmed via Stripe webhook`);
};

/**
 * Handle payment_intent.payment_failed webhook event
 */
export const handlePaymentFailed = async (
  event: any
): Promise<void> => {
  const paymentIntent = event.data.object as any;
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) return;

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'failed',
    $push: {
      trackingUpdates: {
        status: 'payment_failed',
        message: 'Payment failed. Please try again.',
        timestamp: new Date(),
      },
    },
  });

  console.log(`❌ Order ${orderId} payment failed`);
};

/**
 * Refund a Stripe payment
 */
export const refundPayment = async (
  paymentIntentId: string,
  amount?: number
): Promise<any> => {
  const refundParams: any = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundParams.amount = Math.round(amount * 100); // convert to paise
  }

  const refund = await stripe.refunds.create(refundParams);
  return refund;
};

/**
 * Retrieve a PaymentIntent by ID
 */
export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<any> => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

export default stripe;

