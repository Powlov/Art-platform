import Stripe from 'stripe';
import { getDb } from './db';
import type { transactions } from '../drizzle/schema';
import { transactions as transactionsTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// Initialize Stripe only if API key is provided
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('[Stripe] API key not configured. Stripe webhooks will not be processed.');
}

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  const db = await getDb();
  if (!db) {
    console.error('[Stripe] Database not available');
    return;
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[Stripe] Payment succeeded:', paymentIntent.id);

        // Update transaction status
        if (paymentIntent.metadata?.transactionId) {
          const transactionId = parseInt(paymentIntent.metadata.transactionId);
          await db
            .update(transactionsTable)
            .set({
              status: 'completed',
              transactionHash: paymentIntent.id,
              updatedAt: new Date(),
            })
            .where(eq(transactionsTable.id, transactionId));

          console.log('[Stripe] Transaction updated:', transactionId);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[Stripe] Payment failed:', paymentIntent.id);

        // Update transaction status
        if (paymentIntent.metadata?.transactionId) {
          const transactionId = parseInt(paymentIntent.metadata.transactionId);
          await db
            .update(transactionsTable)
            .set({
              status: 'cancelled',
              transactionHash: paymentIntent.id,
              updatedAt: new Date(),
            })
            .where(eq(transactionsTable.id, transactionId));

          console.log('[Stripe] Transaction marked as cancelled:', transactionId);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('[Stripe] Charge refunded:', charge.id);

        // Find and update transaction
        if (charge.payment_intent && typeof charge.payment_intent === 'string') {
          // In production, would query transaction by payment_intent
          console.log('[Stripe] Processing refund for payment:', charge.payment_intent);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[Stripe] Subscription deleted:', subscription.id);
        break;
      }

      default:
        console.log('[Stripe] Unhandled event type:', event.type);
    }
  } catch (error) {
    console.error('[Stripe] Webhook error:', error);
    throw error;
  }
}

/**
 * Create a payment intent for artwork purchase
 */
export async function createPaymentIntent(
  artworkId: number,
  buyerId: number,
  amount: number,
  currency: string = 'usd'
) {
  if (!stripe) {
    console.warn('[Stripe] Not configured. Returning mock payment intent.');
    return {
      id: `pi_mock_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency,
      metadata: { artworkId: artworkId.toString(), buyerId: buyerId.toString() },
    } as any;
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        artworkId: artworkId.toString(),
        buyerId: buyerId.toString(),
      },
    });

    console.log('[Stripe] Payment intent created:', paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error('[Stripe] Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Confirm payment intent
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
) {
  if (!stripe) {
    console.warn('[Stripe] Not configured. Returning mock confirmation.');
    return { id: paymentIntentId, status: 'succeeded' } as any;
  }
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    console.log('[Stripe] Payment intent confirmed:', paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error('[Stripe] Error confirming payment intent:', error);
    throw error;
  }
}

/**
 * Retrieve payment intent
 */
export async function getPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    console.warn('[Stripe] Not configured. Returning mock payment intent.');
    return { id: paymentIntentId, status: 'succeeded' } as any;
  }
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('[Stripe] Error retrieving payment intent:', error);
    throw error;
  }
}

/**
 * Create refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
) {
  if (!stripe) {
    console.warn('[Stripe] Not configured. Returning mock refund.');
    return { id: `re_mock_${Date.now()}`, status: 'succeeded' } as any;
  }
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: (reason as any) || 'requested_by_customer',
    });

    console.log('[Stripe] Refund created:', refund.id);
    return refund;
  } catch (error) {
    console.error('[Stripe] Error creating refund:', error);
    throw error;
  }
}

/**
 * List payment intents for a customer
 */
export async function listPaymentIntents(customerId: string, limit: number = 10) {
  if (!stripe) {
    console.warn('[Stripe] Not configured. Returning empty list.');
    return [];
  }
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit,
    });

    return paymentIntents.data;
  } catch (error) {
    console.error('[Stripe] Error listing payment intents:', error);
    throw error;
  }
}
