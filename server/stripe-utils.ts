/**
 * Stripe Payment Integration
 * Handles payment sessions, webhooks, and transaction processing
 */

import Stripe from 'stripe';

// Initialize Stripe with API key from environment
// In production, set STRIPE_SECRET_KEY environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';

// Initialize Stripe client
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export interface CreateCheckoutSessionParams {
  userId: number;
  userEmail: string;
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: number;
}

/**
 * Create Stripe Checkout Session for deposit
 */
export async function createStripeCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CheckoutSession> {
  const { userId, userEmail, amount, currency = 'USD', successUrl, cancelUrl, metadata = {} } = params;

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Wallet Deposit',
              description: `Add ${currency} ${amount.toFixed(2)} to your ART BANK wallet`,
              images: ['https://artbank.market/logo.png'], // Replace with actual logo URL
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId: userId.toString(),
        type: 'wallet_deposit',
        amount: amount.toString(),
        currency,
        ...metadata,
      },
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url || '',
      amount,
      currency,
      status: 'created',
      expiresAt: session.expires_at,
    };
  } catch (error: any) {
    console.error('Stripe checkout session creation failed:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error);
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
}

/**
 * Retrieve Stripe Checkout Session
 */
export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error: any) {
    console.error('Failed to retrieve checkout session:', error);
    throw new Error(`Failed to retrieve session: ${error.message}`);
  }
}

/**
 * List customer payment methods
 */
export async function listCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return paymentMethods.data;
  } catch (error: any) {
    console.error('Failed to list payment methods:', error);
    throw new Error(`Failed to list payment methods: ${error.message}`);
  }
}

/**
 * Create refund for a payment
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer',
    });
    return refund;
  } catch (error: any) {
    console.error('Failed to create refund:', error);
    throw new Error(`Failed to create refund: ${error.message}`);
  }
}

/**
 * Get payment intent details
 */
export async function retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error: any) {
    console.error('Failed to retrieve payment intent:', error);
    throw new Error(`Failed to retrieve payment intent: ${error.message}`);
  }
}

/**
 * Check if Stripe is configured correctly
 */
export function isStripeConfigured(): boolean {
  return stripeSecretKey !== 'sk_test_mock_key' && stripeSecretKey.startsWith('sk_');
}

/**
 * Get Stripe client instance (for advanced usage)
 */
export function getStripeClient(): Stripe {
  return stripe;
}

export default {
  createStripeCheckoutSession,
  verifyWebhookSignature,
  retrieveCheckoutSession,
  listCustomerPaymentMethods,
  createRefund,
  retrievePaymentIntent,
  isStripeConfigured,
  getStripeClient,
};
