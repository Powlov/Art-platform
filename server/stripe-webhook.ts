/**
 * Stripe Webhook Handler
 * Processes Stripe webhook events for payment confirmations
 */

import { Request, Response } from 'express';
import { verifyWebhookSignature, retrieveCheckoutSession } from './stripe-utils';
import { depositFunds, createWalletIfNotExists } from './wallet-utils';
import { getDb } from './db';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];

  if (!signature || typeof signature !== 'string') {
    console.error('Missing Stripe signature');
    return res.status(400).send('Missing Stripe signature');
  }

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(req.body, signature, STRIPE_WEBHOOK_SECRET);

    console.log(`Received Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object);
        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment intent failed:', event.data.object.id);
        await handlePaymentFailed(event.data.object);
        break;

      case 'charge.refunded':
        console.log('Charge refunded:', event.data.object.id);
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    res.json({ received: true, eventType: event.type });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: any) {
  const sessionId = session.id;
  const userId = parseInt(session.metadata?.userId || '0');
  const amount = parseFloat(session.metadata?.amount || '0');
  const currency = session.metadata?.currency || 'USD';

  console.log(`Processing completed session ${sessionId} for user ${userId}, amount: ${amount}`);

  if (!userId || !amount || amount <= 0) {
    console.error('Invalid session metadata:', session.metadata);
    return;
  }

  const db = getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  try {
    // Ensure wallet exists
    createWalletIfNotExists(userId);

    // Add funds to wallet
    const transaction = depositFunds(
      userId,
      amount,
      `Stripe deposit - Session ${sessionId}`,
      session.payment_intent,
      {
        sessionId,
        currency,
        paymentMethod: session.payment_method_types?.[0] || 'card',
      }
    );

    // Update payment session status
    try {
      db.prepare(`
        UPDATE payment_sessions
        SET status = 'completed', completed_at = ?
        WHERE session_id = ?
      `).run(Math.floor(Date.now() / 1000), sessionId);
    } catch (error) {
      console.error('Failed to update payment session:', error);
    }

    console.log(`✅ Deposit completed: User ${userId}, Amount ${amount}, Transaction ${transaction.id}`);
  } catch (error: any) {
    console.error('Failed to process deposit:', error);
    
    // Update payment session status to failed
    try {
      db.prepare(`
        UPDATE payment_sessions SET status = 'cancelled' WHERE session_id = ?
      `).run(sessionId);
    } catch (updateError) {
      console.error('Failed to update payment session status:', updateError);
    }
  }
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutSessionExpired(session: any) {
  const sessionId = session.id;
  console.log(`Session expired: ${sessionId}`);

  const db = getDb();
  if (!db) return;

  // Update payment session status
  try {
    db.prepare(`
      UPDATE payment_sessions SET status = 'expired' WHERE session_id = ?
    `).run(sessionId);
  } catch (error) {
    console.error('Failed to update payment session status:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: any) {
  const paymentIntentId = paymentIntent.id;
  console.log(`Payment failed: ${paymentIntentId}`);

  // You can implement additional logic here
  // For example, notify the user or retry logic
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: any) {
  const chargeId = charge.id;
  const amount = charge.amount_refunded / 100; // Convert from cents
  const currency = charge.currency.toUpperCase();

  console.log(`Charge refunded: ${chargeId}, Amount: ${amount} ${currency}`);

  // Implement refund logic here
  // You might want to deduct from user's wallet or create a refund transaction
}

/**
 * Register webhook route in Express
 */
export function setupStripeWebhook(app: any) {
  // Important: Use raw body for Stripe webhook signature verification
  app.post('/api/webhooks/stripe', 
    // Express raw body parser middleware
    (req: Request, res: Response, next: any) => {
      if (req.originalUrl === '/api/webhooks/stripe') {
        req.body = req.body;
      }
      next();
    },
    handleStripeWebhook
  );

  console.log('✅ Stripe webhook registered at /api/webhooks/stripe');
}

export default {
  handleStripeWebhook,
  setupStripeWebhook,
};
